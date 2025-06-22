# syntax = docker/dockerfile:1
ARG BUN_VERSION=1.2.2

# ---- Build Stage ----
FROM oven/bun:${BUN_VERSION}-slim AS build
WORKDIR /app
ENV NODE_ENV="production"

COPY package.json bun.lock ./
RUN bun install --ci

COPY . .

RUN bun run prisma:generate
RUN bun run build

# ---- Final Stage ----
FROM oven/bun:${BUN_VERSION}-slim
WORKDIR /app
ENV NODE_ENV="production"

RUN groupadd --system --gid 1001 appgroup && \
    useradd --system --uid 1001 --gid appgroup appuser

COPY --from=build --chown=appuser:appgroup /app/dist /app/dist
COPY --from=build --chown=appuser:appgroup /app/prisma /app/prisma
COPY --from=build --chown=appuser:appgroup /app/package.json /app/package.json


USER appuser

CMD [ "bun", "run", "start:migrate" ]