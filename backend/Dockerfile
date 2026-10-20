
FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma

RUN npx prisma generate

COPY server.js ./
COPY routes ./routes
COPY controllers ./controllers
COPY services ./services

EXPOSE 3000

CMD ["npm", "start"]
