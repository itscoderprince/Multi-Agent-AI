FROM node:22-alpine

WORKDIR /app

# Install root dependencies (ioredis, dotenv)
COPY package*.json ./
RUN npm install --omit=dev

# Copy shared utilities & middleware
COPY shared/ ./shared/

# Install gateway dependencies
COPY gateway/package*.json ./gateway/
WORKDIR /app/gateway
RUN npm install --omit=dev

# Copy gateway source code
COPY gateway/ ./

EXPOSE 1000

CMD ["node", "index.js"]
