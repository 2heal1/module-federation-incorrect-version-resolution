# Module Federation Bug Reproduction

This repo contains code that reproduces incorrect version resolution for eager shared modules in
case when several versions of the same module are available and the latest version is not available
for eager consumption, but earlier versions are.

The library used here for example - `tiny-emitter`. I restricted version in root workspace to `=2.0.0` to force
earlier version installation. *This is important.*

Note: Makefile recipes relies on docker-compose & traefik.