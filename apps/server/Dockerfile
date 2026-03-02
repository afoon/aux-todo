FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

WORKDIR /app

# Copy workspace config and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy server package
COPY apps/server/package.json ./apps/server/
COPY apps/server/prisma ./apps/server/prisma
COPY apps/server/prisma.config.ts ./apps/server/

# Install dependencies (from root to get workspace deps)
RUN pnpm install --frozen-lockfile

# Generate Prisma client
WORKDIR /app/apps/server
RUN pnpm exec prisma generate

# Copy server source
COPY apps/server .
COPY apps/server/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["./docker-entrypoint.sh"]
