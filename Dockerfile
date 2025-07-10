# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.2.17

# ---- Build Stage ----
FROM oven/bun:${BUN_VERSION}-slim AS build
WORKDIR /app
ENV NODE_ENV="production"

COPY package.json bun.lock ./
RUN bun install --ci

COPY tsconfig.json .

COPY prisma ./prisma
RUN bun run prisma:generate

COPY src ./src
RUN bun run build

# ---- Deploy Stage ----
FROM oven/bun:${BUN_VERSION}-slim
WORKDIR /app
ENV NODE_ENV="production"
RUN apt-get update -y && apt-get install -y openssl

# Copy only the necessary files from the build stage
# Don't need node_modules directory as bun bundles all dependencies
COPY --from=build --chown=appuser:appgroup /app/dist /app/dist
COPY --from=build --chown=appuser:appgroup /app/prisma /app/prisma
COPY --from=build --chown=appuser:appgroup /app/package.json /app/package.json

CMD [ "bun", "start:prod" ]