FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

WORKDIR /app

# Copy workspace config and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy client package
COPY apps/client ./apps/client

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the client
WORKDIR /app/apps/client
ARG VITE_API_URL=http://localhost:3000
ARG VITE_SOCKET_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
RUN pnpm run build

# Serve with vite preview
EXPOSE 5173
CMD ["pnpm", "exec", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"]
