import { writeFileSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

import {
  checkAnnouncements,
  checkDeprecated,
  checkRemovals,
  checkReplacements,
} from "../src/contract.ts";
import {
  appearances,
  checkAppearances,
  checkDirectNames,
  checkKeptPaths,
  checkNamespaces,
  checkWholePixels,
  emitLegacyStylesheet,
  emitPublicTokens,
  emitStylesheet,
  emitTypes,
  emitValues,
  isSameAppearance,
} from "../src/emit.ts";

import {
  buildAppearance,
  contract,
  deprecations,
  directNames,
  fail,
  keptPaths,
} from "./sources.ts";

const here = dirname(fileURLToPath(import.meta.url));
const generatedDir = resolvePath(here, "../src/__generated__");

const [light, dark] = appearances.map(buildAppearance);

if (light === undefined || dark === undefined) {
  fail("both appearances must resolve");
} else {
  const bothPresent = checkAppearances(light, dark);
  if (bothPresent.isErr()) {
    fail(
      `these tokens are defined in one appearance only:\n  ${bothPresent.error.join("\n  ")}`,
    );
  }

  const reachable = checkNamespaces(dark);
  if (reachable.isErr()) {
    fail(
      `these semantic tokens sit outside a Tailwind namespace and would generate no class:\n  ${reachable.error.join("\n  ")}`,
    );
  }

  const whole = checkWholePixels(dark);
  if (whole.isErr()) {
    fail(
      `these type steps are not a whole number of pixels at the base size:\n  ${whole.error.join("\n  ")}`,
    );
  }

  const direct = checkDirectNames(dark, directNames);
  if (direct.isErr()) {
    fail(
      `these legacy names point at a token that does not exist:\n  ${direct.error.join("\n  ")}`,
    );
  }

  const kept = checkKeptPaths(dark, keptPaths);
  if (kept.isErr()) {
    fail(
      `the legacy sheet is asked to keep a token that does not exist:\n  ${kept.error.join("\n  ")}`,
    );
  }

  const announced = checkDeprecated(dark, deprecations);
  if (announced.isErr()) {
    fail(
      `these tokens are marked deprecated but no longer exist, so the window they promised is already over:\n  ${announced.error.join("\n  ")}`,
    );
  }

  const explained = checkAnnouncements(deprecations);
  if (explained.isErr()) {
    fail(
      `every deprecation has to say when it was announced and why, so a consumer can act on it:\n  ${explained.error.join("\n  ")}`,
    );
  }

  const replacements = checkReplacements(dark, deprecations);
  if (replacements.isErr()) {
    fail(
      `these deprecations send a consumer somewhere that does not exist:\n  ${replacements.error.join("\n  ")}`,
    );
  }

  const removals = checkRemovals(dark, contract);
  if (removals.isErr()) {
    fail(
      `these tokens were published in ${contract.version} and have been removed without a deprecation window:\n  ${removals.error.join("\n  ")}`,
    );
  }

  writeFileSync(
    resolvePath(generatedDir, "tokens.css"),
    emitStylesheet(light, dark),
  );
  writeFileSync(
    resolvePath(generatedDir, "legacy.css"),
    emitLegacyStylesheet(light, dark, directNames, keptPaths),
  );
  writeFileSync(resolvePath(generatedDir, "tokens.ts"), emitTypes(dark));
  writeFileSync(resolvePath(generatedDir, "values.ts"), emitValues(dark));
  writeFileSync(
    resolvePath(generatedDir, "tokens.public.json"),
    emitPublicTokens(light, dark, deprecations),
  );

  process.stdout.write(`${dark.length} tokens written\n`);

  if (isSameAppearance(light, dark)) {
    process.stdout.write(
      "light and dark hold the same values, so no light appearance has been designed yet\n",
    );
  }
}
