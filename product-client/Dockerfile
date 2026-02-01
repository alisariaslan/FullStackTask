# 1. Base aşaması
FROM node:20-alpine AS base

# 2. Deps aşaması
FROM base AS deps
WORKDIR /app
COPY package*.json ./
# Lock dosyasına göre temiz kurulum
RUN npm ci || npm install

# 3. Builder aşaması
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js build al
RUN npm run build

# 4. Runner aşaması
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Public klasörünü kopyala
COPY --from=builder /app/public ./public


# Kaynak: /app/src/messages (Builder'daki yer)
# Hedef: ./src/messages (Runner'da olması gereken yer)
COPY --from=builder /app/src/messages ./src/messages

# Standalone çıktılar
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# Standalone modda server.js ile başlanır
CMD ["node", "server.js"]