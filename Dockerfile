FROM node:22-alpine3.18 as base

RUN corepack enable
RUN corepack prepare pnpm@latest-9 --activate

# All deps stage
FROM base as deps
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Production only deps stage
FROM base as production-deps
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Build stage
FROM base as build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build

# Production stage
FROM base
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
ENV TZ=UTC

WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
EXPOSE 8080
CMD ["node", "./bin/server.js"]
