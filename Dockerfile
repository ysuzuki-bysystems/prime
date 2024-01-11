FROM node:20 AS builder

RUN mkdir /work
WORKDIR /work
COPY package.json package-lock.json /work
RUN npm ci --verbose

COPY src/ next.config.js tsconfig.json /work
RUN npm run build

FROM node:20
EXPOSE 3000
COPY --from=builder /work/.next/standalone /app
CMD ["node", "/app/server.js"]
