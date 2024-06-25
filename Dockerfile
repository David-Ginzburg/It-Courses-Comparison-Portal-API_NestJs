ARG NODE_VERSION=22-alpine

# build
FROM node:${NODE_VERSION} as build
WORKDIR /opt/app
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# deploy
FROM node:${NODE_VERSION}
WORKDIR /opt/app
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/node_modules ./node_modules
COPY ./package*.json ./
RUN npm prune --omit=dev

# environment
ARG NODE_ENV
ARG MONGO_DOCKER_URI
ARG MONGO_INITDB_ROOT_USERNAME
ARG MONGO_INITDB_ROOT_PASSWORD
ARG JWT_SECRET

ENV NODE_ENV=$NODE_ENV
ENV MONGO_DOCKER_URI=$MONGO_DOCKER_URI
ENV MONGO_INITDB_ROOT_USERNAME=$MONGO_INITDB_ROOT_USERNAME
ENV MONGO_INITDB_ROOT_PASSWORD=$MONGO_INITDB_ROOT_PASSWORD
ENV JWT_SECRET=$JWT_SECRET

CMD ["node", "./dist/main.js"]
EXPOSE 3000