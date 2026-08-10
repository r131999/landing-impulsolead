# syntax=docker/dockerfile:1

# ---- Build ----
# node:22-slim (glibc) em vez de node:22-alpine: evita risco de incompatibilidade
# do binário nativo do sharp (otimização de imagem) com musl. Não afeta a imagem
# final — só o estágio de build, que não é publicado.
FROM node:22-slim AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime ----
FROM nginx:1.27-alpine AS runtime

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
