# Dockerfile для SmartInventory Backend API (ЛР7 — CI/CD)
# Багатоетапна збірка для оптимального розміру Docker-образу

# Етап 1: Збірка (Build stage)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Етап 2: Продакшн (Production stage)
FROM node:18-alpine AS production
WORKDIR /app

# Безпечний користувач (не root)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S smartinv -u 1001

COPY --from=builder --chown=smartinv:nodejs /app/dist ./dist
COPY --from=builder --chown=smartinv:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=smartinv:nodejs /app/package.json ./

USER smartinv
EXPOSE 5000

CMD ["node", "dist/main.js"]
