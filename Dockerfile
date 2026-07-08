# Stage 1: Build stage
FROM cgr.dev/chainguard/node:latest-dev AS builder
USER root
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Stage 2: Ultra-secure production server using Chainguard Nginx
FROM cgr.dev/chainguard/nginx:latest AS runtime
WORKDIR /usr/share/nginx/html

# Copy ONLY the compiled static HTML/JS/CSS assets from the builder
COPY --from=builder /app/dist .

# Copy custom nginx config to listen on port 3000
COPY nginx.conf /etc/nginx/nginx.conf

# Chainguard Nginx defaults to unprivileged port 8080 or standard 80
EXPOSE 3000
