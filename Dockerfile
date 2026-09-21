FROM oven/bun:1.3.5

WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile && bun run build:web

ENV NODE_ENV=production
EXPOSE 10000

CMD ["bun", "run", "start:web"]
