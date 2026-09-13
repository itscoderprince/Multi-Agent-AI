import dotenv from "dotenv";
dotenv.config({ quiet: true });

import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const groq = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0,
  maxRetries: 2,
});

export const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
  maxRetries: 2,
});

/**
 * Returns the optimal LLM instance for a given agent
 * @param {string} agent - Name of the agent (e.g. 'chat', 'coding', 'search', 'pdf', 'ppt', 'vision')
 * @returns {ChatGroq | ChatGoogleGenerativeAI}
 */
export const getModel = (agent) => {
  switch (agent) {
    case "coding":
    case "pdf":
    case "vision":
    case "search":
      return gemini; // Gemini excels at large context, search synthesis, multimodal vision, and deep reasoning
    case "chat":
    case "ppt":
    default:
      return groq; // Groq excels at ultra-low latency response generation
  }
};

