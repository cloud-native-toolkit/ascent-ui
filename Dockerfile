FROM registry.access.redhat.com/ubi8/nodejs-16:1-52 as builder

ARG NODE_OPTIONS="--max-old-space-size=4096"

USER default

WORKDIR /opt/app-root/src

COPY --chown=default:root . .
RUN npm ci && \
    npm run build

FROM registry.access.redhat.com/ubi8/nodejs-16-minimal:1-52

USER 1001

WORKDIR /opt/app-root/src

COPY --from=builder --chown=1001:0 /opt/app-root/src/build ./build
COPY --chown=1001:0 package.json package-lock.json ./
COPY --chown=1001:0 server ./server

RUN npm ci --production && \
    npm cache clean --force

ENV NODE_ENV=production
ENV HOST=0.0.0.0 PORT=3000

EXPOSE 3000/tcp

CMD ["npm", "start"]
