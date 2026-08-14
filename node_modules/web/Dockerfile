# syntax=docker/dockerfile:1

ARG NODE_VERSION=26.7
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Root workspace files
COPY package.json package-lock.json ./

# Web workspace package file
COPY services/web/package.json ./services/web/package.json

# Install dependencies using the root lockfile
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --workspace=services/web

# Copy only the web source
COPY services/web/src ./services/web/src

USER node

EXPOSE 8000

CMD ["npm", "start", "--workspace=services/web"]