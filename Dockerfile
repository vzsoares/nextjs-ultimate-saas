FROM node:22-slim as builder

WORKDIR /usr/src/app

ARG BUILD_TYPE
ARG BASE_CLIENT
ARG USE_LOCALHOST="FALSE"

# ensure BUILD_TYPE
RUN test -n "$BUILD_TYPE"
# BASE_CLIENT only required if BUILD_TYPE == INSTANCES
RUN if [ "$BUILD_TYPE" = "INSTANCES" ] ; then \
  test -n "$BASE_CLIENT" || exit 1 ; fi;

COPY [".", "./"]

RUN [ -f .env ] && rm .env 2> /dev/null
RUN touch .env

ENV NEXT_PUBLIC_BUILD_TYPE=$BUILD_TYPE
ENV NEXT_PUBLIC_BASE_CLIENT=$BASE_CLIENT
ENV NEXT_PUBLIC_USE_LOCALHOST=$USE_LOCALHOST

RUN yarn install --ignore-scripts --frozen-lockfile && yarn next build

FROM alpine as runner

ENV PORT "3000"

WORKDIR /usr/src/app

# COPY --from=builder ["/usr/src/app/yarn.lock", "./"]
# COPY --from=builder ["/usr/src/app/package.json", "./"]
# COPY --from=builder ["/usr/src/app/.env", "./"]
COPY --from=builder ["/usr/src/app/.next", "./.next"]
COPY --from=builder ["/usr/src/app/node_modules", "./node_modules"]
# COPY --from=builder ["/usr/src/app/next.config.js", "./"]
# COPY --from=builder ["/usr/src/app/next-env.d.ts", "./"]
# COPY --from=builder ["/usr/src/app/src", "./src"]
# COPY --from=builder ["/usr/src/app/public", "./public"]

RUN apk add --update nodejs npm

# EXPOSE $PORT

CMD npm start -- -p "${PORT}"
