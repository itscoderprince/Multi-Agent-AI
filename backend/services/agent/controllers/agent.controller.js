import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../configs/Memmory.js";
import {
  asyncHandler,
  sendSuccess,
  AppError,
} from "../../../shared/utils/response.js";

/**
 * Agent Controller
 * Processes a user prompt through the multi-agent graph and persists
 * both the user message and the AI response in the Chat Service & Redis memory.
 */
export const agent = asyncHandler(async (req, res) => {
  const { prompt, chatId, conversationId } = req.body;
  const targetChatId = chatId || conversationId;

  if (!prompt || !prompt.trim()) {
    throw new AppError("Prompt is required", 400);
  }

  const userId = req.headers["x-user-id"];
  const chatServiceUrl = process.env.CHAT_SERVICE || "http://localhost:3000";

  // 1. Persist User Message to Chat Service & Redis Memory
  if (targetChatId) {
    try {
      await axios.post(
        `${chatServiceUrl}/${targetChatId}/messages`,
        {
          role: "user",
          content: prompt.trim(),
        },
        {
          headers: {
            "x-user-id": userId || "",
          },
        }
      );
    } catch (err) {
      console.warn(
        `[Agent Controller]: Could not save user message to chat ${targetChatId}:`,
        err.response?.data?.message || err.message
      );
    }

    await addMessage(targetChatId, { role: "user", content: prompt.trim() });
  }

  // 2. Execute Multi-Agent Graph
  const graphResult = await graph.invoke({
    prompt: prompt.trim(),
    chatId: targetChatId,
  });

  // 3. Persist Assistant Response to Chat Service & Redis Memory
  let savedMessage = null;
  if (targetChatId) {
    try {
      const response = await axios.post(
        `${chatServiceUrl}/${targetChatId}/messages`,
        {
          role: "assistant",
          content: graphResult.aiResponse,
        },
        {
          headers: {
            "x-user-id": userId || "",
          },
        }
      );
      savedMessage = response.data?.data;
    } catch (err) {
      console.warn(
        `[Agent Controller]: Could not save assistant response to chat ${targetChatId}:`,
        err.response?.data?.message || err.message
      );
    }

    await addMessage(targetChatId, {
      role: "assistant",
      content: graphResult.aiResponse,
    });
  }

  // 4. Send standardized success response
  return sendSuccess(
    res,
    {
      agent: graphResult.agent,
      prompt: graphResult.prompt,
      aiResponse: graphResult.aiResponse,
      chatId: targetChatId || null,
      message: savedMessage,
    },
    "Agent response generated successfully 🤖🚀",
    200
  );
});

export default agent;

