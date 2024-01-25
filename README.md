# Module Federation Bug Reproduction

This repo contains code that reproduces incorrect version resolution for eager shared modules in
case when several versions of the same module are available and the latest version is not available
for eager consumption, but earlier versions are.

The library used here for example - `tiny-emitter`. I restricted version in root workspace to `=2.0.0` to force
earlier version installation. *This is important.*

Note: Makefile recipes relies on docker-compose & traefik.

Steps:

1. Install packages, via `yarn install` or `make node_modules` (if you like to use docker).
2. Build scripts, via `yarn build:legacy && yarn build:next` or `make build` (docker).
3. Start the sever via `SERVER_PORT=8080 node ./server.mjs` or `make up` (this also requires traefik alongside with docker).
4. Go to `localhost:8080` or `module-federation.reproduction.test` (traefik).
5. See console.

On the latest commit no errors should be displayed. Switch to the first commit to see the error.
