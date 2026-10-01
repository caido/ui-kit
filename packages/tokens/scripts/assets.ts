import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolvePath(here, "..");
const dist = resolvePath(root, "dist");

const assets: [source: string, published: string][] = [
  ["src/__generated__/tokens.css", "tokens.css"],
  ["src/__generated__/legacy.css", "legacy.css"],
  ["src/__generated__/plugin-compat.css", "plugin-compat.css"],
  ["src/__generated__/plugin-primevue.css", "plugin-primevue.css"],
  ["src/vendor/plugin-utilities.css", "plugin-utilities.css"],
  ["src/vendor/plugin-light.css", "plugin-light.css"],
  ["src/vendor/plugin-light-important.css", "plugin-light-important.css"],
  ["src/__generated__/tokens.public.json", "tokens.json"],
  ["src/vendor/primevue.css", "primevue.css"],
  ["src/vendor/fonts.css", "fonts.css"],
  ["src/vendor/fonts/Inter.woff2", "fonts/Inter.woff2"],
  ["src/vendor/fonts/LICENSE-Inter.txt", "fonts/LICENSE-Inter.txt"],
];

for (const [source, published] of assets) {
  const target = resolvePath(dist, published);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(resolvePath(root, source), target);
}

process.stdout.write(`${assets.length} assets copied into dist\n`);
