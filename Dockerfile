FROM node:20-slim

WORKDIR /app

# Instala OpenSSL e dependências básicas para o Prisma
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE 3120

CMD ["npm", "run", "dev"]
