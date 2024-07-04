FROM node:22-slim as builder

WORKDIR /app

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

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN apk add --update nodejs npm

USER nextjs
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

CMD HOSTNAME="0.0.0.0" node server.js


