#!/usr/bin/env bash
set -e

knip \
  --production \
  --include files,exports,types,dependencies

eslint packages/**/src -c ./eslint.config.mjs --fix
