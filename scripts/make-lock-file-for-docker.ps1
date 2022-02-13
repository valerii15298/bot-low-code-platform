pnpm -C packages/api remove @prisma/client
cp pnpm-lock.yaml pnpm-lock-for-docker.yaml
pnpm -C packages/api add @prisma/client
