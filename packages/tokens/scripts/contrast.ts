import { checkPairing, type Pairing } from "../src/contrast.ts";
import {
  type Appearance,
  type ColorValue,
  isColorValue,
} from "../src/resolve.ts";

import { buildAppearance, readJson } from "./sources.ts";

type Accepted = {
  foreground: string;
  background: string;
  usage: string;
  appearance?: Appearance;
  reason: string;
};

const { pairings } = readJson("pairings.json") as { pairings: Pairing[] };
const { accepted } = readJson("contrast-accepted.json") as {
  accepted: Accepted[];
};

const appearances: Appearance[] = ["light", "dark"];

const valuesByAppearance = new Map<string, Map<string, ColorValue>>(
  appearances.map((appearance) => [
    appearance,
    new Map(
      buildAppearance(appearance).flatMap((token) =>
        isColorValue(token.value)
          ? [[token.path, token.value] as [string, ColorValue]]
          : [],
      ),
    ),
  ]),
);

const results = appearances.flatMap((appearance) =>
  pairings.map((pairing) => ({
    appearance,
    pairing,
    result: checkPairing(
      pairing,
      valuesByAppearance.get(appearance) ?? new Map(),
    ),
  })),
);

type Entry = (typeof results)[number];

const matchesAccepted = (entry: Entry, acceptance: Accepted) =>
  acceptance.foreground === entry.pairing.foreground &&
  acceptance.background === entry.pairing.background &&
  acceptance.usage === entry.pairing.usage &&
  (acceptance.appearance === undefined ||
    acceptance.appearance === entry.appearance);

const isAccepted = (entry: Entry) =>
  accepted.some((acceptance) => matchesAccepted(entry, acceptance));

const unknown = results.filter((entry) => entry.result === undefined);
const failing = results.filter(
  (entry) => entry.result !== undefined && !entry.result.passes,
);

const unexpected = failing.filter((entry) => !isAccepted(entry));
const staleAcceptance = accepted.filter(
  (acceptance) => !failing.some((entry) => matchesAccepted(entry, acceptance)),
);

const formatResult = (entry: Entry) => {
  const { appearance, pairing, result } = entry;
  const ratio = result === undefined ? "?" : result.ratio.toFixed(2);
  const required = result === undefined ? "?" : result.required.toFixed(1);
  return `  [${appearance}] ${pairing.foreground} on ${pairing.background} as ${pairing.usage}: ${ratio} against ${required} required, ${pairing.sites} sites`;
};

if (unknown.length > 0) {
  process.stderr.write(
    `these pairings name a token that does not exist:\n${unknown.map(formatResult).join("\n")}\n`,
  );
  process.exit(1);
}

if (staleAcceptance.length > 0) {
  process.stderr.write(
    `these accepted failures now pass and should be removed from contrast-accepted.json:\n${staleAcceptance
      .map(
        (acceptance) =>
          `  ${acceptance.foreground} on ${acceptance.background} as ${acceptance.usage}${acceptance.appearance === undefined ? "" : ` [${acceptance.appearance}]`}`,
      )
      .join("\n")}\n`,
  );
  process.exit(1);
}

if (unexpected.length > 0) {
  process.stderr.write(
    `these pairings fall below the contrast floor:\n${unexpected.map(formatResult).join("\n")}\n`,
  );
  process.exit(1);
}

process.stdout.write(
  `${pairings.length} pairings checked in ${appearances.length} appearances, ${failing.length} accepted failures carried\n`,
);
