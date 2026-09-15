import { err, ok, type Result } from "neverthrow";

import { type ResolvedToken } from "./resolve.ts";

type Deprecation = {
  /** The token to move to. Absent when a name is going away with nothing taking its job. */
  replacement?: string;
  /** The released version that announced the deprecation. */
  since: string;
  /** Why the name is going, in a sentence a plugin author can act on. */
  reason: string;
};

export type Deprecations = Record<string, Deprecation>;

export type Contract = {
  /** The released version these names were published under. */
  version: string;
  /** Every token name that release emitted. */
  names: string[];
  /** The subset of `names` that release had already marked deprecated. */
  deprecated: string[];
};

export const checkDeprecated = (
  tokens: ResolvedToken[],
  deprecations: Deprecations,
): Result<undefined, string[]> => {
  const paths = new Set(tokens.map((token) => token.path));
  const missing = Object.keys(deprecations).filter((path) => !paths.has(path));

  return missing.length === 0 ? ok(undefined) : err(missing.sort());
};

export const checkReplacements = (
  tokens: ResolvedToken[],
  deprecations: Deprecations,
): Result<undefined, string[]> => {
  const paths = new Set(tokens.map((token) => token.path));
  const stray = Object.entries(deprecations).flatMap(([path, entry]) =>
    entry.replacement !== undefined && !paths.has(entry.replacement)
      ? [`${path} points at ${entry.replacement}, which does not exist`]
      : [],
  );

  return stray.length === 0 ? ok(undefined) : err(stray.sort());
};

export const checkAnnouncements = (
  deprecations: Deprecations,
): Result<undefined, string[]> => {
  const silent = Object.entries(deprecations).flatMap(([path, entry]) => {
    const missing = [
      entry.since.trim() === "" ? "since" : undefined,
      entry.reason.trim() === "" ? "reason" : undefined,
    ].filter((field) => field !== undefined);

    return missing.length === 0
      ? []
      : [`${path} is missing ${missing.join(" and ")}`];
  });

  return silent.length === 0 ? ok(undefined) : err(silent.sort());
};

export const checkRemovals = (
  tokens: ResolvedToken[],
  contract: Contract,
): Result<undefined, string[]> => {
  const paths = new Set(tokens.map((token) => token.path));
  const announced = new Set(contract.deprecated);
  const removed = contract.names.filter((path) => !paths.has(path));
  const abrupt = removed.filter((path) => !announced.has(path));

  return abrupt.length === 0 ? ok(undefined) : err(abrupt.sort());
};

export const buildContract = (
  version: string,
  tokens: ResolvedToken[],
  deprecations: Deprecations,
): Contract => {
  const names = tokens.map((token) => token.path).sort();

  return {
    version,
    names,
    deprecated: names.filter((path) => path in deprecations),
  };
};
