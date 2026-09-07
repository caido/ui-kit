#!/usr/bin/env bash
set -e

knip \
  --production \
  --include files,exports,types,dependencies

eslint packages/**/src "packages/design-system/.vitepress/**/*.{ts,mts,vue}" -c ./eslint.config.mjs --fix
