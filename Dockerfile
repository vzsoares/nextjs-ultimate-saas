FROM node:lts-slim as builder

WORKDIR /usr/src/app

COPY [".","./"]

ARG CLIENT
ARG PORT

RUN [ -f .env ] && rm .env 2> /dev/null

RUN touch .env && \
    echo "NEXT_PUBLIC_CLIENT=$CLIENT" >> .env

RUN yarn install

RUN yarn next build

FROM alpine as runner

ARG PORT

ENV PORT ${PORT}

WORKDIR /usr/src/app

COPY --from=builder ["/usr/src/app/yarn.lock", "./"]
COPY --from=builder ["/usr/src/app/package.json", "./"]
COPY --from=builder ["/usr/src/app/.env", "./"]
COPY --from=builder ["/usr/src/app/.next", "./.next"]
COPY --from=builder ["/usr/src/app/node_modules", "./node_modules"]
COPY --from=builder ["/usr/src/app/next.config.js", "./"]
COPY --from=builder ["/usr/src/app/next-env.d.ts", "./"]
COPY --from=builder ["/usr/src/app/src", "./src"]
COPY --from=builder ["/usr/src/app/public", "./public"]

RUN apk add --update nodejs npm

# EXPOSE $PORT

CMD npm start -- -p ${PORT}
