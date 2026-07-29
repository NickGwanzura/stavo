# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci --legacy-peer-deps
RUN npx prisma generate

COPY . .
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output (this includes server.js, node_modules, package.json at root)
COPY --from=builder /app/.next/standalone ./

# Copy static files
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma for runtime migrations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production

# Run migration (continue if it fails) then start server
CMD sh -c "npx prisma migrate deploy --schema=./prisma/schema.prisma 2>&1 || true; node server.js"
