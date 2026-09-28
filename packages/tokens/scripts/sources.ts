import { readFileSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

import { Result } from "neverthrow";

import { type Contract, type Deprecations } from "../src/contract.ts";
import {
  type Appearance,
  flattenTokens,
  type ResolvedToken,
  resolveTokens,
} from "../src/resolve.ts";

const here = dirname(fileURLToPath(import.meta.url));
const tokensDir = resolvePath(here, "../src/tokens");

const parseJson = Result.fromThrowable(
  (path: string): unknown => JSON.parse(readFileSync(path, "utf8")),
  (cause) => (cause instanceof Error ? cause.message : String(cause)),
);

export const readJson = <T>(relative: string): Result<T, string> =>
  parseJson(resolvePath(tokensDir, relative))
    .map((value) => value as T)
    .mapErr((reason) => `${relative} could not be read: ${reason}`);

export const fail = (message: string): never => {
  process.stderr.write(`${message}\n`);
  process.exit(1);
};

const orFail = <T>(result: Result<T, string>): T =>
  result.match(
    (value) => value,
    (reason) => fail(reason),
  );

type Manifest = {
  sets: Record<string, { sources: { $ref: string }[] }>;
  modifiers: Record<string, { contexts: Record<string, { $ref: string }[]> }>;
  resolutionOrder: { $ref: string }[];
};

export const manifest = orFail(readJson<Manifest>("resolver.json"));

type Legacy = {
  direct: Record<string, string>;
  keep: string[];
};

const legacy = orFail(readJson<Legacy>("legacy.json"));

export const directNames = legacy.direct;
export const keptPaths = legacy.keep;

type PluginCompat = { names: Record<string, string> };

export const compatNames = orFail(
  readJson<PluginCompat>("plugin-compat.json"),
).names;

type PluginPrimevueFile = {
  base: Record<string, string>;
  semantic: Record<string, string>;
  rootDeclarations: Record<string, string>;
};

export const pluginPrimevue = orFail(
  readJson<PluginPrimevueFile>("plugin-primevue.json"),
);

type DeprecationsFile = { deprecated: Deprecations };

export const deprecations = orFail(
  readJson<DeprecationsFile>("deprecations.json"),
).deprecated;

export const contract = orFail(readJson<Contract>("contract.json"));

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
    orFail(readJson<unknown>(source.$ref)),
  );
  const resolved = resolveTokens(flattenTokens(documents));

  if (resolved.isErr()) {
    return fail(`${appearance}: ${resolved.error}`);
  }

  return resolved.value;
};
