FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm add -g pnpm

RUN pnpm install

RUN pnpm -C packages/api exec prisma migrate dev --name init

CMD [ "pnpm", "runAll" ]