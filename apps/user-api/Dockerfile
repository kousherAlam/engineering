

FROM node:20.9.0-slim AS builder
RUN apt-get update
WORKDIR /app
COPY . .
RUN npm ci --ignore-scripts
RUN npm run build
RUN npm ci --omit=dev --ignore-scripts


FROM node:20.9.0-slim AS runner
RUN addgroup --system --gid 1001 apiuser
RUN adduser --system --uid 1001 --home /app apiuser
RUN adduser apiuser apiuser
USER apiuser
WORKDIR /app
COPY --chown=apiuser:apiuser --from=builder /app .
CMD ["node", "dist/apps/user-api/main.js"]
