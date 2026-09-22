FROM node:22-alpine

WORKDIR /app

# Install root dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy shared utilities & middleware
COPY shared/ ./shared/

# Install chat dependencies
COPY services/chat/package*.json ./services/chat/
WORKDIR /app/services/chat
RUN npm install --omit=dev

# Copy chat source code
COPY services/chat/ ./

EXPOSE 3000

CMD ["node", "index.js"]
