FROM registry.access.redhat.com/ubi8/nodejs-16:1-72 AS builder

USER root

RUN dnf -y install autoconf automake diffutils file zlib && \
    dnf clean all

USER default

ENV NODE_ENV=dev CPPFLAGS="-DPNG_ARM_NEON_OPT=0"
WORKDIR /opt/app-root/src

COPY --chown=default:root . .
RUN npm ci && \
    npm run build

ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000

EXPOSE 3000/tcp

CMD ["npm", "start"]
