import { StateGraph, START, END } from "@langchain/langgraph";
import { agentState } from "./states.js";
import { router } from "./router.js";
import {
  chatAgent,
  codingAgent,
  visionAgent,
  pdfAgent,
  pptAgent,
  searchAgent,
} from "../agents/index.js";

const workflow = new StateGraph(agentState);

// 1. Register Nodes
workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("vision", visionAgent);

// 2. Start -> Router
workflow.addEdge(START, "router");

// 3. Conditional routing based on state.agent
workflow.addConditionalEdges(
  "router",
  (state) => {
    const target = state.agent || "chat";
    console.log(`[Graph 🚀]: Dispatching execution to specialist node -> "${target}"`);
    switch (state.agent) {
      case "chat":
        return "chat";
      case "search":
        return "search";
      case "coding":
        return "coding";
      case "pdf":
        return "pdf";
      case "ppt":
        return "ppt";
      case "vision":
      case "imageGen":
        return "vision";
      default:
        return "chat";
    }
  },
  {
    chat: "chat",
    search: "search",
    coding: "coding",
    pdf: "pdf",
    ppt: "ppt",
    vision: "vision",
  },
);

// 4. Edges matching Architecture Diagram:
// Search Agent feeds into Chat Agent (Search-Augmented Synthesis)
workflow.addEdge("search", "chat");

// Terminal nodes -> END
workflow.addEdge("chat", END);
workflow.addEdge("coding", END);
workflow.addEdge("pdf", END);
workflow.addEdge("ppt", END);
workflow.addEdge("vision", END);

// 5. Compile and export the graph
export const graph = workflow.compile();
export default graph;

