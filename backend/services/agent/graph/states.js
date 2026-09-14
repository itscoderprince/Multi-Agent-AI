import { Annotation } from "@langchain/langgraph";

export const agentState = Annotation.Root({
  prompt: Annotation(),
  aiResponse: Annotation(),
  agent: Annotation(),
  chatId: Annotation(),
  searchResults: Annotation(),
  images: Annotation(),
  artifacts: Annotation(),
  uiFiles: Annotation(),     // ui_generation: [{name, content}] file schema
});
