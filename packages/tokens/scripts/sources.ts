import { readFileSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

import { type Contract, type Deprecations } from "../src/contract.ts";
import {
  type Appearance,
  flattenTokens,
  type ResolvedToken,
  resolveTokens,
} from "../src/resolve.ts";

const here = dirname(fileURLToPath(import.meta.url));
const tokensDir = resolvePath(here, "../src/tokens");

export const readJson = (relative: string): unknown =>
  JSON.parse(readFileSync(resolvePath(tokensDir, relative), "utf8"));

export const fail = (message: string): never => {
  process.stderr.write(`${message}\n`);
  process.exit(1);
};

type Manifest = {
  sets: Record<string, { sources: { $ref: string }[] }>;
  modifiers: Record<string, { contexts: Record<string, { $ref: string }[]> }>;
  resolutionOrder: { $ref: string }[];
};

export const manifest = readJson("resolver.json") as Manifest;

type Legacy = {
  direct: Record<string, string>;
  keep: string[];
};

const legacy = readJson("legacy.json") as Legacy;

export const directNames = legacy.direct;
export const keptPaths = legacy.keep;

type PluginCompat = { names: Record<string, string> };

export const compatNames = (readJson("plugin-compat.json") as PluginCompat)
  .names;

type PluginPrimevueFile = {
  base: Record<string, string>;
  semantic: Record<string, string>;
  rootDeclarations: Record<string, string>;
};

export const pluginPrimevue = readJson(
  "plugin-primevue.json",
) as PluginPrimevueFile;

type DeprecationsFile = { deprecated: Deprecations };

export const deprecations = (readJson("deprecations.json") as DeprecationsFile)
  .deprecated;

export const contract = readJson("contract.json") as Contract;

const getSources = (appearance: Appearance) =>
  manifest.resolutionOrder.flatMap((entry) => {
    const [, kind, name] = entry.$ref.split("/");
    if (kind === "sets") return manifest.sets[name ?? ""]?.sources ?? [];
    if (kind === "modifiers") {
      return manifest.modifiers[name ?? ""]?.contexts[appearance] ?? [];
    }
    return [];
  });

export const buildAppearance = (appearance: Appearance): ResolvedToken[] => {
  const documents = getSources(appearance).map((source) =>
    readJson(source.$ref),
  );
  const resolved = resolveTokens(flattenTokens(documents));

  if (resolved.isErr()) {
    return fail(`${appearance}: ${resolved.error}`);
  }

  return resolved.value;
};
