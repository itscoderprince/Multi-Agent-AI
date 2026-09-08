import axios from "axios";
import { graph } from "../graph/graph.js";
import {
  asyncHandler,
  sendSuccess,
  AppError,
} from "../../../shared/utils/response.js";

/**
 * Agent Controller
 * Processes a user prompt through the multi-agent graph and persists
 * both the user message and the AI response in the Chat Service.
 */
export const agent = asyncHandler(async (req, res) => {
  const { prompt, chatId, conversationId } = req.body;
  const targetChatId = chatId || conversationId;

  if (!prompt || !prompt.trim()) {
    throw new AppError("Prompt is required", 400);
  }

  const userId = req.headers["x-user-id"];
  const chatServiceUrl = process.env.CHAT_SERVICE || "http://localhost:3000";

  // 1. Persist User Message to Chat Service (if chatId is provided)
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
  }

  // 2. Execute Multi-Agent Graph (Router -> Specialist Agent -> Response)
  const graphResult = await graph.invoke({ prompt: prompt.trim() });

  // 3. Persist Assistant Response to Chat Service (if chatId is provided)
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

