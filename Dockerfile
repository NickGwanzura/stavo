# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat openssl

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build output (includes server.js, package.json, node_modules)
COPY --from=builder /app/.next/standalone ./

# Copy static assets
COPY --from=builder /app/.next/static ./.next/static

# Copy public assets
COPY --from=builder /app/public ./public

# Copy Prisma schema + migrations for runtime migration
COPY --from=builder /app/prisma ./prisma

# Copy Prisma client from node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy next.config
COPY --from=builder /app/next.config.mjs ./

# Set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production
ENV PRISMA_SCHEMA_DIR=/app/prisma

# Run migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma 2>&1 || echo 'Migration skipped or failed - continuing...' && node server.js"]
