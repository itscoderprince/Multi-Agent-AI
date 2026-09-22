FROM node:20-alpine

WORKDIR /app

# Copy backend source code
COPY backend/package*.json ./backend/
COPY backend/gateway/package*.json ./backend/gateway/
COPY backend/services/auth/package*.json ./backend/services/auth/
COPY backend/services/chat/package*.json ./backend/services/chat/
COPY backend/services/agent/package*.json ./backend/services/agent/

# Install dependencies for each microservice
RUN cd backend/gateway && npm install --omit=dev
RUN cd backend/services/auth && npm install --omit=dev
RUN cd backend/services/chat && npm install --omit=dev
RUN cd backend/services/agent && npm install --omit=dev

# Copy entire backend
COPY backend/ ./backend/

ENV NODE_ENV=production
ENV AUTH_SERVICE=http://127.0.0.1:2000
ENV CHAT_SERVICE=http://127.0.0.1:3000
ENV AGENT_SERVICE=http://127.0.0.1:4000

EXPOSE 1000

# Run all 3 internal microservices in background, Gateway in foreground
CMD sh -c "\
  node backend/services/auth/index.js & \
  node backend/services/chat/index.js & \
  node backend/services/agent/index.js & \
  node backend/gateway/index.js \
"
