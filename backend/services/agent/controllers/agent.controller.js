import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../configs/Memmory.js";
import {
  asyncHandler,
  sendSuccess,
  AppError,
} from "../../../shared/utils/response.js";
import http from "http";

const httpAgent = new http.Agent({ keepAlive: true });
const internalClient = axios.create({ httpAgent, timeout: 5000 });

/**
 * Agent Controller
 * Processes a user prompt through the multi-agent graph with non-blocking persistence
 * for ultra-fast response times.
 */
export const agent = asyncHandler(async (req, res) => {
  const { prompt, chatId, conversationId, agent: requestedAgent } = req.body;
  const targetChatId = chatId || conversationId;

  if (!prompt || !prompt.trim()) {
    throw new AppError("Prompt is required", 400);
  }

  const userId = req.headers["x-user-id"];
  const chatServiceUrl = process.env.CHAT_SERVICE || "http://localhost:3000";

  // 1. Persist User Message in background / parallel so graph.invoke starts immediately!
  const userSavePromise = targetChatId
    ? (async () => {
        const payload = { role: "user", content: prompt.trim() };
        const headers = { "x-user-id": userId || "" };
        const url = `${chatServiceUrl}/${targetChatId}/messages`;

        try {
          await internalClient.post(url, payload, { headers });
        } catch (err) {
          // New chats: MongoDB write may not have propagated yet → retry once after 500ms
          if (err.response?.status === 404) {
            await new Promise((r) => setTimeout(r, 500));
            try {
              await internalClient.post(url, payload, { headers });
            } catch (retryErr) {
              console.warn(`[Agent Controller]: Retry also failed for chat ${targetChatId}:`, retryErr.message);
            }
          } else {
            console.warn(`[Agent Controller]: Could not save user message to chat ${targetChatId}:`, err.message);
          }
        }

        await addMessage(targetChatId, { role: "user", content: prompt.trim() });
      })()
    : Promise.resolve();

  // 2. Execute Multi-Agent Graph immediately (no waiting on MongoDB Atlas user save)
  const graphResult = await graph.invoke({
    prompt: prompt.trim(),
    chatId: targetChatId,
    ...(requestedAgent && requestedAgent !== "auto" ? { agent: requestedAgent } : {}),
  });

  const artifactPayload = graphResult.uiFiles?.length
    ? {
        id: Date.now(),
        type: "application/code",
        files: graphResult.uiFiles,
      }
    : null;

  // 3. Persist Assistant Response in background so client gets response with zero delay
  if (targetChatId) {
    (async () => {
      // Ensure user message save finished first
      await userSavePromise.catch(() => {});

      try {
        await internalClient.post(
          `${chatServiceUrl}/${targetChatId}/messages`,
          {
            role: "assistant",
            content: graphResult.aiResponse,
            images: graphResult.images || [],
            artifact: artifactPayload,
            uiFiles: graphResult.uiFiles || [],
          },
          {
            headers: {
              "x-user-id": userId || "",
            },
          }
        );
      } catch (err) {
        console.warn(
          `[Agent Controller]: Could not save assistant response to chat ${targetChatId}:`,
          err.message
        );
      }

      await addMessage(targetChatId, {
        role: "assistant",
        content: graphResult.aiResponse,
        images: graphResult.images || [],
        artifact: artifactPayload,
        uiFiles: graphResult.uiFiles || [],
      });
    })().catch((err) => console.error("[Agent Controller BG Save Error]:", err.message));
  }

  // 4. Send response immediately the instant the LLM completes!
  return sendSuccess(
    res,
    {
      agent: graphResult.agent,
      prompt: graphResult.prompt,
      aiResponse: graphResult.aiResponse,
      chatId: targetChatId || null,
      images: graphResult.images || [],
      uiFiles: graphResult.uiFiles || null,
      artifact: artifactPayload,
    },
    "Agent response generated successfully 🤖🚀",
    200
  );
});

export default agent;

