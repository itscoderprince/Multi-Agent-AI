# Multi-Agent AI — Frontend (SarthiAi)

The modern conversational user interface for the **Multi-Agent AI** platform.

Built with **React 19**, **Vite 8**, **Tailwind CSS v4**, **Redux Toolkit**, and **Firebase Authentication**.

---

## 📖 In-Depth Frontend Documentation

For the complete technical architecture manual, component hierarchy, Redux state machine, API flows, and engineering roadmap, see:

👉 **[FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)**

---

## 🚀 Quick Start

### 1. Install Dependencies
```powershell
npm install
```

### 2. Start Vite Development Server
```powershell
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🏛️ Spatial Architecture & Key Components

| Section | Component | Description |
| :--- | :--- | :--- |
| **Authentication** | [`LoginCard.jsx`](src/components/auth/LoginCard.jsx) | Google OAuth popup via Firebase & Demo mode bypass |
| **Navigation** | [`Sidebar.jsx`](src/components/sidebar/Sidebar.jsx) | Collapsible conversation list, New Chat, and demo presets |
| **Active Chat** | [`Chat.jsx`](src/components/chat/Chat.jsx) | Main chat container orchestrating navigation, messages, and input |
| **Messages View** | [`ChatMsg.jsx`](src/components/chat/messages/ChatMsg.jsx) | Welcome screen with suggested prompts, Markdown message history, and typing indicator |
| **Input Bar** | [`ChatInput.jsx`](src/components/chat/ChatInput.jsx) | Floating pill input bar, search toggle, and optimistic message dispatch |
| **Inspector** | [`Artifact.jsx`](src/components/artifact/Artifact.jsx) | Right-hand panel for code, documents, and diagram previews |
