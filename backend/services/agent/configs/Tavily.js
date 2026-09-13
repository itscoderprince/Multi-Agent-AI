import { TavilySearch } from "@langchain/tavily";

// Standard web search (text only - fast, no clutter)
export const SearchTool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  includeImages: false,
});

// Visual search tool (fetches images when visual context or clothes/photos/stars are queried)
export const VisualSearchTool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  includeImages: true,
});