# GenX-DOS — the whole static site + self-hosted emulator suite, served by nginx.
# The site is entirely client-side (no build step): copy it into the web root
# and serve. The root index.html redirects to prompt/. nginx's bundled
# mime.types already maps .wasm to application/wasm, so the cores stream fine.
FROM nginx:alpine

# Version is passed in by the publish workflow (build-arg VERSION) so the
# package description below always names the release it was built from.
ARG VERSION=dev

# Links the published image to the repo (shows under the repo's Packages),
# carries provenance, and gives the package page a description that states
# the version and format.
LABEL org.opencontainers.image.source="https://github.com/Retro-Jack/GenX-DOS"
LABEL org.opencontainers.image.version="${VERSION}"
LABEL org.opencontainers.image.description="GenX-DOS v${VERSION} — container image: the full GenX-DOS static site (browser DOS-prompt terminal + 8-bit emulator suite) served by nginx. Run it with: docker run -p 8080:80 ghcr.io/retro-jack/genx-dos"
LABEL org.opencontainers.image.licenses="CC-BY-NC-4.0"

RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html/

EXPOSE 80

# nginx:alpine already runs `nginx -g 'daemon off;'`.
