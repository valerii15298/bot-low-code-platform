# bot-low-code-platform

## Installation

```bash
$ git clone https://github.com/valerii15298/bot-low-code-platform.git
$ cd bot-low-code-platform
$ echo "DATABASE_URL=\"postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:5432\"" > packages/api/.env
$ npm install -g pnpm
$ pnpm install
$ pnpm -C packages/api exec prisma migrate --name init
```

## Running the app
###Linux:
```bash
$ pnpm -r dev & pnpm -C packages/web run codegen
```
###Any other OS:
```bash
$ pnpm add -g concurrently
$ concurrently "pnpm -r dev" "pnpm -C packages/web run codegen"
```

## Stay in touch

- Author - [Valerii Petryniak](https://valerii15298.github.io)

[//]: # (- Website - [https://nestjs.com]&#40;https://valerii15298.github.io&#41;)

- Telegram - [@valerii15298](https://t.me/valerii15298)
