FROM node:16-alpine

WORKDIR /usr/src/app

RUN apk --no-cache add curl
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY pnpm-lock.yaml ./

RUN pnpm fetch

COPY . ./

RUN pnpm -r install --offline
RUN pnpm -r install --offline


EXPOSE 3000
EXPOSE 8080
EXPOSE 8081
EXPOSE 4000

CMD ["sleep", "1000000"]
#CMD [ "pnpm", "run", "startAll" ]
