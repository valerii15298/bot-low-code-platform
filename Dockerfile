FROM node:16-alpine

WORKDIR /usr/src/app

RUN apk --no-cache add curl
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm


COPY ./pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store\
    pnpm fetch

COPY . ./

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store\
      pnpm -r install --frozen-lockfile --offline

EXPOSE 3000

CMD [ "pnpm", "run", "start:prod" ]
