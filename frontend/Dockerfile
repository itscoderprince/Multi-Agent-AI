FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_SERVER_URL=http://localhost:1000
ARG VITE_FIREBASE_API_KEY=AIzaSyDx_1CgkQ2L3jEqUVSgPirYneuvJxe2WrQ

ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
