FROM node:22-alpine

WORKDIR /app

# Install root dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy shared utilities & middleware
COPY shared/ ./shared/

# Install agent dependencies
COPY services/agent/package*.json ./services/agent/
WORKDIR /app/services/agent
RUN npm install --omit=dev

# Copy agent source code
COPY services/agent/ ./

EXPOSE 4000

CMD ["node", "index.js"]
