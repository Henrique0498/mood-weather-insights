FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --ignore-scripts

FROM base AS build

COPY tsconfig*.json nest-cli.json biome.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma

COPY package.json ./

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/main.js"]
