import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";

import { toVariableName } from "../src/emit.ts";

import { deprecations, fail } from "./sources.ts";

const EXTENSIONS = [".css", ".ts", ".tsx", ".js", ".jsx", ".vue", ".html"];
const SKIP = new Set(["node_modules", "dist", ".git", ".tsc"]);

const args = process.argv.slice(2);
const write = args.includes("--write");
const targets = args.filter((arg) => !arg.startsWith("--"));

if (targets.length === 0) {
  fail("usage: codemod [--write] <path>...");
}

const renames = Object.entries(deprecations).flatMap(([path, entry]) =>
  entry.replacement === undefined
    ? []
    : [
        [toVariableName(path), toVariableName(entry.replacement)] as const,
        [path, entry.replacement] as const,
      ],
);

if (renames.length === 0) {
  process.stdout.write("no deprecation names a replacement, nothing to do\n");
}

const walk = (target: string): string[] => {
  const stats = statSync(target);
  if (stats.isFile()) {
    return EXTENSIONS.some((ext) => target.endsWith(ext)) ? [target] : [];
  }

  return readdirSync(target, { withFileTypes: true }).flatMap((entry) =>
    SKIP.has(entry.name) ? [] : walk(resolvePath(target, entry.name)),
  );
};

let changed = 0;
let occurrences = 0;

for (const file of targets.flatMap(walk)) {
  const before = readFileSync(file, "utf8");
  let after = before;

  for (const [from, to] of renames) {
    const parts = after.split(from);
    occurrences += parts.length - 1;
    after = parts.join(to);
  }

  if (after === before) continue;
  changed += 1;
  if (write) writeFileSync(file, after);
  process.stdout.write(`${write ? "rewrote" : "would rewrite"} ${file}\n`);
}

process.stdout.write(
  `${occurrences} occurrences in ${changed} files${write ? " rewritten" : ", run again with --write to apply"}\n`,
);
