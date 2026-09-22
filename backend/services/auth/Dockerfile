FROM node:22-alpine

WORKDIR /app

# Install root dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy shared utilities & middleware
COPY shared/ ./shared/

# Install auth dependencies
COPY services/auth/package*.json ./services/auth/
WORKDIR /app/services/auth
RUN npm install --omit=dev

# Copy auth source code
COPY services/auth/ ./

EXPOSE 2000

CMD ["node", "index.js"]
