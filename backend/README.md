# Multi-Agent AI — Backend

Welcome to the backend core for **Multi-Agent AI**.

This backend is architected as an event-driven, decoupled microservices system with an API Gateway, Redis session caching, MongoDB Atlas persistent data storage, and a LangGraph-powered multi-agent orchestration engine.

---

## 📖 In-Depth Backend Documentation

For the complete, comprehensive technical architecture manual, code flows, data models, and engineering roadmap, see:

👉 **[BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)**

---

## 🚀 Quick Start

### 1. Start Redis
```powershell
docker compose -f docker-compose.yml up -d
```

### 2. Start All Services Concurrently
From the project root:
```powershell
npm run dev:backend
```

### 3. Service Ports & Topology
| Service | Directory | Port | Description |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `gateway/` | `1000` | Single entry point, CORS, cookie validation, reverse proxy |
| **Auth Service** | `services/auth/` | `2000` | Firebase Google OAuth verification, user syncing, Redis session issuer |
| **Chat Service** | `services/chat/` | `3000` | Conversation threads, message histories, cascading deletions |
| **Agent Service** | `services/agent/` | `4000` | LangGraph multi-agent orchestration (Groq + Google Gemini) |
| **Redis** | `docker-compose.yml` | `6379` | In-memory session store (7-day TTL) |
