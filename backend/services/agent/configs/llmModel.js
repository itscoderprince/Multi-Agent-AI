import dotenv from "dotenv";
dotenv.config({ quiet: true });

import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";

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

// DeepSeek V4 Flash — code-optimized, 1M context, near-free at $0.06/M tokens
export const deepseek = new ChatOpenRouter({
  model: "deepseek/deepseek-v4-flash-0731",
  apiKey: process.env.OPENROUTER_API_KEY,
  temperature: 0,
  maxTokens: 8192,
  maxRetries: 2,
});

/**
 * Returns the optimal LLM instance for a given agent.
 * @param {string} agent - Agent name: 'chat' | 'coding' | 'search' | 'pdf' | 'ppt' | 'vision'
 * @returns {ChatGroq | ChatGoogleGenerativeAI | ChatOpenRouter}
 */
export const getModel = (agent) => {
  switch (agent) {
    case "coding":
      return deepseek; // DeepSeek V4 Flash — code-optimized, near-free ($0.06/M), 1M context
    case "pdf":
    case "vision":
    case "search":
      return gemini; // Gemini — excels at large context, search synthesis & multimodal vision
    case "chat":
    case "ppt":
    default:
      return groq; // Groq — ultra-low latency for conversational responses
  }
};

