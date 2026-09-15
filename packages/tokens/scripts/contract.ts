import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

import { buildContract } from "../src/contract.ts";
import { appearances } from "../src/emit.ts";

import { buildAppearance, deprecations, fail } from "./sources.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolvePath(here, "..");

const { version } = JSON.parse(
  readFileSync(resolvePath(root, "package.json"), "utf8"),
) as { version: string };

const [, dark] = appearances.map(buildAppearance);

if (dark === undefined) {
  fail("the dark appearance must resolve");
} else {
  const contract = buildContract(version, dark, deprecations);

  writeFileSync(
    resolvePath(root, "src/tokens/contract.json"),
    `${JSON.stringify(contract, undefined, 2)}\n`,
  );

  process.stdout.write(
    `contract frozen at ${version}: ${contract.names.length} names, ${contract.deprecated.length} deprecated\n`,
  );
}
