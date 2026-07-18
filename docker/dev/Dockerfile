FROM node:24

RUN corepack enable && corepack prepare pnpm@11 --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN HUSKY=0 pnpm install

COPY . .

EXPOSE 5502

CMD ["pnpm", "run", "dev"]
