/**
 * Curated demo conversations demonstrating multi-agent capabilities,
 * architecture patterns, and realistic workflows.
 */
export const DEMO_CHATS = [
  {
    _id: "demo-chat-1",
    title: "Multi-Agent System Architecture",
    isDemo: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    messages: [
      {
        _id: "demo-msg-1-1",
        role: "user",
        content:
          "How does multi-agent coordination work in distributed AI architectures?",
      },
      {
        _id: "demo-msg-1-2",
        role: "assistant",
        content:
          "In distributed multi-agent architectures, coordination relies on three foundational pillars:\n\n1. **Role Specialization**: Agents have narrow, well-defined responsibilities (e.g., Planner, Executor, Verifier, and Memory Retrieval).\n2. **Shared State & Message Bus**: Agents communicate asynchronously over event brokers (such as Redis Streams or WebSockets) exchanging structured schemas.\n3. **Consensus & Orchestration**: A supervisory agent synthesizes outputs and resolves conflicts before delivering final responses to the user.",
      },
    ],
  },
  {
    _id: "demo-chat-2",
    title: "React & Tailwind v4 Migration",
    isDemo: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    messages: [
      {
        _id: "demo-msg-2-1",
        role: "user",
        content:
          "What are the main advantages of upgrading to Tailwind CSS v4 in our frontend?",
      },
      {
        _id: "demo-msg-2-2",
        role: "assistant",
        content:
          "Tailwind v4 introduces a reimagined engine built for speed and simplicity:\n\n- **CSS-First Configuration**: Eliminates `tailwind.config.js` in favor of native CSS `@theme` and `@utility` rules.\n- **Sub-millisecond Builds**: Integrates natively with `@tailwindcss/vite` for instant hot-module-replacement.\n- **Zero-config Modern CSS**: Native cascade layers, `@custom-variant`, and container query support without extra plugins.",
      },
    ],
  },
  {
    _id: "demo-chat-3",
    title: "API Gateway Security Pipeline",
    isDemo: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    messages: [
      {
        _id: "demo-msg-3-1",
        role: "user",
        content:
          "How does the API Gateway handle token validation and route authorization?",
      },
      {
        _id: "demo-msg-3-2",
        role: "assistant",
        content:
          "The Gateway intercepts incoming traffic on port 1000 and applies `checkAuth` middleware:\n\n1. Validates session cookies against Redis.\n2. Injects downstream user metadata (`x-user-id` and `x-user-email`) into proxy headers.\n3. Transparently routes requests to the Chat service (port 3000) or Agent service (port 4000) without exposing backend ports publicly.",
      },
    ],
  },
];

export default DEMO_CHATS;
