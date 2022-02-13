FROM node:16-alpine

WORKDIR /usr/src/app

RUN apk --no-cache add curl
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

#just to persist it in pnpm stroe
RUN pnpm add @prisma/client && rm package.json && rm pnpm-lock.yaml

COPY ./pnpm-lock-for-docker.yaml ./pnpm-lock.yaml
COPY pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store\
    pnpm fetch

COPY ./pnpm-lock.yaml ./
RUN pnpm fetch

COPY . ./

RUN  pnpm -r install --frozen-lockfile --offline

EXPOSE 3000
EXPOSE 8080
EXPOSE 8081
EXPOSE 4000

CMD [ "pnpm", "run", "startAll" ]
