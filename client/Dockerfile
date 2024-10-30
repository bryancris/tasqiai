# Build stage
FROM node:18-alpine AS builder

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    SKIP_ENV_VALIDATION=1 \
    DATABASE_URL="postgresql://postgres:postgres@db:5432/tasqiai"

WORKDIR /app

# Install dependencies required for node-gyp and sharp
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files and prisma schema first for better caching
COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY next.config.mjs ./
COPY tsconfig.json ./

# Install dependencies with clean npm cache and legacy peer deps
RUN npm cache clean --force && \
    npm ci --legacy-peer-deps --production=false

# Generate Prisma Client before copying the rest of the files
RUN npx prisma generate

# Copy application code
COPY . .

# Build the application
RUN SKIP_ENV_VALIDATION=1 npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_URL="postgresql://postgres:postgres@db:5432/tasqiai"

# Install dependencies required for Prisma
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Copy Prisma schema and generated client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/prisma ./prisma

# Verify Prisma client exists
RUN if [ ! -d "./node_modules/.prisma/client" ]; then \
      echo "Prisma client not found" && exit 1; \
    fi

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Set permissions
RUN chown -R nextjs:nodejs /app
RUN chmod -R 750 /app

# Switch to non-root user
USER nextjs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]