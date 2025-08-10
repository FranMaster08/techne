# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ormconfig*.ts ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY ormconfig.ts ./
COPY --from=builder /app/dist ./dist

RUN npm install --legacy-peer-deps
# Instalar tsconfig-paths para registrar rutas de TypeScript
RUN npm install tsconfig-paths --legacy-peer-deps

ENV NODE_ENV=production
CMD ["sh", "-c", "node dist/src/main.js"]