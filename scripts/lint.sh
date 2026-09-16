#!/usr/bin/env bash
set -e

knip \
  --production \
  --include files,exports,types,dependencies

eslint packages/**/src packages/design-system/.vitepress -c ./eslint.config.mjs --fix
