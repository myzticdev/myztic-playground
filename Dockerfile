FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
ARG VITE_ANALYTICS_PROVIDER=none
ARG VITE_ANALYTICS_SITE_ID=
ARG VITE_ANALYTICS_SCRIPT_URL=
ARG VITE_ANALYTICS_HOST=
ENV VITE_ANALYTICS_PROVIDER=$VITE_ANALYTICS_PROVIDER
ENV VITE_ANALYTICS_SITE_ID=$VITE_ANALYTICS_SITE_ID
ENV VITE_ANALYTICS_SCRIPT_URL=$VITE_ANALYTICS_SCRIPT_URL
ENV VITE_ANALYTICS_HOST=$VITE_ANALYTICS_HOST
RUN node scripts/render-nginx-config.mjs nginx.conf /app/generated-nginx.conf
RUN npm run build

FROM nginx:1.30.4-alpine
COPY --from=build /app/generated-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
