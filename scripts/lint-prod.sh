#!/usr/bin/env bash
set -e

knip \
  --production \
  --include files,exports,types,dependencies

ESLINT_ENV=production NODE_OPTIONS=--max-old-space-size=4096 eslint packages/**/src -c ./eslint.config.mjs --max-warnings 0