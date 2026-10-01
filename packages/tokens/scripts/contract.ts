import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

import { err, ok, type Result } from "neverthrow";

import { buildContract } from "../src/contract.ts";
import { appearances } from "../src/emit.ts";

import { buildAppearance, deprecations, fail } from "./sources.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolvePath(here, "..");

const freeze = (): Result<string, string> => {
  const { version } = JSON.parse(
    readFileSync(resolvePath(root, "package.json"), "utf8"),
  ) as { version: string };

  const [, dark] = appearances.map(buildAppearance);

  if (dark === undefined) {
    return err("the dark appearance must resolve");
  }

  const contract = buildContract(version, dark, deprecations);

  writeFileSync(
    resolvePath(root, "src/tokens/contract.json"),
    `${JSON.stringify(contract, undefined, 2)}\n`,
  );

  return ok(
    `contract frozen at ${version}: ${contract.names.length} names, ${contract.deprecated.length} deprecated`,
  );
};

freeze().match(
  (report) => process.stdout.write(`${report}\n`),
  (reason) => fail(reason),
);
