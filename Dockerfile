# syntax = docker/dockerfile:1

ARG BUN_VERSION

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

RUN groupadd --system --gid 1001 appgroup && \
    useradd --system --uid 1001 --gid appgroup appuser

# Copy only the necessary files from the build stage
# Don't need node_modules directory as bun bundles all dependencies
COPY --from=build --chown=appuser:appgroup /app/dist /app/dist
COPY --from=build --chown=appuser:appgroup /app/prisma /app/prisma

USER appuser

CMD [ "bun", "dist/index.js" ]