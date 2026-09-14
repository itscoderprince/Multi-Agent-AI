import redis from "../../../shared/redis/redis.js";
import getMessages from "../utils/getMessages.js";

const normalize = (msg) => {
  if (!msg) return null;
  const role =
    msg.role === "human" ? "user" : msg.role === "ai" ? "assistant" : msg.role || "user";
  return {
    role,
    content: msg.content || "",
    ...(msg.images?.length ? { images: msg.images } : {}),
  };
};

export const getMemory = async (chatId) => {
  if (!chatId) return [];

  const key = `message-${chatId}`;
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
  } catch (error) {
    console.error("Redis Error:", error.message);
  }

  const messages = (await getMessages(chatId)) || [];
  const recent = messages.slice(-20);
  try {
    if (recent.length) {
      await redis.set(key, JSON.stringify(recent), "EX", 24 * 60 * 60);
    }
  } catch (error) {
    console.error("Redis Error:", error.message);
  }

  return recent;
};

export const addMessage = async (chatId, message, aiResponse) => {
  if (!chatId || !message) return [];

  const key = `message-${chatId}`;
  try {
    const messages = await getMemory(chatId);

    if (typeof message === "string" && typeof aiResponse === "string") {
      messages.push(
        { role: "user", content: message },
        { role: "assistant", content: aiResponse }
      );
    } else if (Array.isArray(message)) {
      messages.push(...message.map(normalize).filter(Boolean));
    } else {
      const formatted = normalize(message);
      if (formatted) {
        const last = messages[messages.length - 1];
        if (!last || last.role !== formatted.role || last.content !== formatted.content) {
          messages.push(formatted);
        }
      }
    }

    const updated = messages.slice(-20);
    await redis.set(key, JSON.stringify(updated), "EX", 24 * 60 * 60);
    return updated;
  } catch (error) {
    console.error("Redis Error:", error.message);
    return [];
  }
};

export default getMemory;