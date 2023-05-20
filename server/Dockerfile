FROM node:alpine
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY ./package.json .
RUN pnpm i
COPY . .
RUN pnpm run build
CMD pnpm start