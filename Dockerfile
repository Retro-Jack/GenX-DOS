# GenX-DOS — the whole static site + self-hosted emulator suite, served by nginx.
# The site is entirely client-side (no build step): copy it into the web root
# and serve. The root index.html redirects to prompt/. nginx's bundled
# mime.types already maps .wasm to application/wasm, so the cores stream fine.
FROM nginx:alpine

# Links the published image to the repo (shows under the repo's Packages) and
# carries basic provenance.
LABEL org.opencontainers.image.source="https://github.com/Retro-Jack/GenX-DOS"
LABEL org.opencontainers.image.description="GenX-DOS — a browser DOS-prompt terminal and self-hosted 8-bit emulator suite."
LABEL org.opencontainers.image.licenses="CC-BY-NC-4.0"

RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html/

EXPOSE 80

# nginx:alpine already runs `nginx -g 'daemon off;'`.
