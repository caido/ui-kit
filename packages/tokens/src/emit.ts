import { err, ok, type Result } from "neverthrow";

import { type Deprecations } from "./contract.ts";
import {
  type Appearance,
  type ColorValue,
  isAmountValue,
  isColorValue,
  isDimensionValue,
  isDurationValue,
  isEasingValue,
  isFontFamilyValue,
  isFontWeightValue,
  isLayerValue,
  isMeasureValue,
  isTypeStepValue,
  type ResolvedToken,
  type TokenValue,
} from "./resolve.ts";

const TAILWIND_NAMESPACES = [
  "color",
  "spacing",
  "text",
  "radius",
  "shadow",
  "font",
  "font-weight",
  "container",
  "z-index",
  "ease",
];

const BRIDGED_NAMESPACES = ["duration", "icon", "opacity"];

const CLEARED_NAMESPACES = [
  "text",
  "font",
  "font-weight",
  "leading",
  "tracking",
  "radius",
  "shadow",
];

const TYPE_BASE_PX = 14;

const PALETTE_ROOT = "palette";

const LAYER_ROOT = "z-index";

const ICON_ROOT = "icon";

const isPalette = (token: ResolvedToken) =>
  token.path.startsWith(`${PALETTE_ROOT}.`);

const isSemantic = (token: ResolvedToken) => !isPalette(token);

const isColorToken = (
  token: ResolvedToken,
): token is ResolvedToken & { value: ColorValue } => isColorValue(token.value);

const toColor = (value: ColorValue) => {
  const [first = 0, second = 0, third = 0] = value.components;
  const body =
    value.colorSpace === "oklch"
      ? `oklch(${first} ${second} ${third})`
      : `hsl(${first}deg ${second}% ${third}%)`;
  if (value.alpha === undefined || value.alpha === 1) return body;
  return value.colorSpace === "oklch"
    ? `oklch(${first} ${second} ${third} / ${value.alpha})`
    : `hsl(${first}deg ${second}% ${third}% / ${value.alpha})`;
};

const toFace = (face: string) => (face.includes(" ") ? `"${face}"` : face);

export const toVariableName = (path: string) =>
  `--${path.split(".").join("-")}`;

const toDeclarations = (token: ResolvedToken): [string, string][] => {
  const name = toVariableName(token.path);
  const value = token.value;

  if (isTypeStepValue(value)) {
    const step: [string, string][] = [
      [name, `calc(${value.size} / ${TYPE_BASE_PX} * 1rem)`],
      [`${name}--line-height`, `calc(${value.leading} / ${value.size})`],
    ];
    if (value.weight !== undefined) {
      step.push([`${name}--font-weight`, `${value.weight}`]);
    }
    return step;
  }

  if (isFontFamilyValue(value)) {
    return [[name, value.stack.map(toFace).join(", ")]];
  }

  if (isFontWeightValue(value)) return [[name, `${value.weight}`]];

  if (isMeasureValue(value)) return [[name, `${value.ch}ch`]];

  if (isDimensionValue(value)) return [[name, `${value.px}px`]];

  if (isLayerValue(value)) return [[name, `${value.index}`]];

  if (isDurationValue(value)) return [[name, `${value.ms}ms`]];

  if (isAmountValue(value)) return [[name, `${value.amount}`]];

  if (isEasingValue(value)) {
    return [[name, `cubic-bezier(${value.curve.join(", ")})`]];
  }

  return [[name, toColor(value)]];
};

const isSameValue = (left: TokenValue, right: TokenValue) =>
  JSON.stringify(left) === JSON.stringify(right);

const toPathIndex = (tokens: ResolvedToken[]) =>
  new Map(tokens.map((token) => [token.path, token]));

export const checkNamespaces = (
  tokens: ResolvedToken[],
): Result<undefined, string[]> => {
  const stray = tokens
    .filter(isSemantic)
    .filter((token) => {
      const namespace = token.path.split(".")[0] ?? "";
      return (
        !TAILWIND_NAMESPACES.includes(namespace) &&
        !BRIDGED_NAMESPACES.includes(namespace)
      );
    })
    .map((token) => token.path);

  return stray.length === 0 ? ok(undefined) : err(stray);
};

export const checkWholePixels = (
  tokens: ResolvedToken[],
): Result<undefined, string[]> => {
  const fractional = tokens
    .filter((token) => isTypeStepValue(token.value))
    .filter((token) => {
      const value = token.value;
      if (!isTypeStepValue(value)) return false;
      return !Number.isInteger(value.size) || !Number.isInteger(value.leading);
    })
    .map((token) => token.path);

  return fractional.length === 0 ? ok(undefined) : err(fractional);
};

export const checkAppearances = (
  light: ResolvedToken[],
  dark: ResolvedToken[],
): Result<undefined, string[]> => {
  const lightPaths = new Set(light.map((token) => token.path));
  const darkPaths = new Set(dark.map((token) => token.path));

  const missing = [
    ...[...darkPaths].filter((path) => !lightPaths.has(path)),
    ...[...lightPaths].filter((path) => !darkPaths.has(path)),
  ];

  return missing.length === 0 ? ok(undefined) : err(missing.sort());
};

export const emitStylesheet = (
  light: ResolvedToken[],
  dark: ResolvedToken[],
) => {
  const lightByPath = toPathIndex(light);
  const darkByPath = toPathIndex(dark);

  const palette = dark
    .filter(isPalette)
    .flatMap(toDeclarations)
    .map(([name, value]) => `  ${name}: ${value};`);

  const cleared = CLEARED_NAMESPACES.map(
    (namespace) => `  --${namespace}-*: initial;`,
  );

  const semantic = dark
    .filter(isSemantic)
    .flatMap((token) => {
      const lightValue = lightByPath.get(token.path)?.value;
      const darkValue = darkByPath.get(token.path)?.value;
      if (lightValue === undefined || darkValue === undefined) return [];

      if (isSameValue(lightValue, darkValue)) return toDeclarations(token);

      if (!isColorValue(lightValue) || !isColorValue(darkValue)) {
        return toDeclarations(token);
      }

      return [
        [
          toVariableName(token.path),
          `light-dark(${toColor(lightValue)}, ${toColor(darkValue)})`,
        ] as [string, string],
      ];
    })
    .map(([name, value]) => `  ${name}: ${value};`);

  return [
    "/* Generated by pnpm --filter @caido/tokens generate. Do not edit. */",
    "",
    ":root {",
    ...palette,
    "}",
    "",
    ":root {",
    "  color-scheme: light dark;",
    "}",
    "",
    ':root[data-appearance="light"] {',
    "  color-scheme: light;",
    "}",
    "",
    ':root[data-appearance="dark"] {',
    "  color-scheme: dark;",
    "}",
    "",
    "@theme static {",
    ...cleared,
    "",
    ...semantic,
    "}",
    "",
  ].join("\n");
};

export const checkDirectNames = (
  tokens: ResolvedToken[],
  direct: Record<string, string>,
): Result<undefined, string[]> => {
  const paths = new Set(tokens.map((token) => token.path));
  const stray = Object.keys(direct).filter((path) => !paths.has(path));

  return stray.length === 0 ? ok(undefined) : err(stray.sort());
};

export const checkKeptPaths = (
  tokens: ResolvedToken[],
  keep: string[],
): Result<undefined, string[]> => {
  const paths = new Set(tokens.map((token) => token.path));
  const stray = keep.filter((path) => !paths.has(path));

  return stray.length === 0 ? ok(undefined) : err(stray.sort());
};

export const emitLegacyStylesheet = (
  light: ResolvedToken[],
  dark: ResolvedToken[],
  direct: Record<string, string> = {},
  keep: string[] | undefined = undefined,
) => {
  const kept = keep === undefined ? undefined : new Set(keep);
  const lightByPath = new Map(light.map((token) => [token.path, token]));

  const declarations = dark
    .filter(isSemantic)
    .filter(isColorToken)
    .filter((token) => kept === undefined || kept.has(token.path))
    .map((token) => {
      const name =
        direct[token.path] ?? `--c-${token.path.split(".").slice(1).join("-")}`;
      const lightValue = lightByPath.get(token.path)?.value;

      const value =
        lightValue === undefined ||
        isSameValue(lightValue, token.value) ||
        !isColorValue(lightValue)
          ? toColor(token.value)
          : `light-dark(${toColor(lightValue)}, ${toColor(token.value)})`;

      return `  ${name}: ${value};`;
    });

  return [
    "/* Generated by pnpm --filter @caido/tokens generate. Do not edit. */",
    "",
    ":root {",
    ...declarations,
    "}",
    "",
  ].join("\n");
};

export const emitTypes = (dark: ResolvedToken[]) => {
  const names = dark
    .flatMap(toDeclarations)
    .map(([name]) => `  | "${name}"`)
    .sort();

  return [
    "/* Generated by pnpm --filter @caido/tokens generate. Do not edit. */",
    "",
    "export type TokenName =",
    ...names,
    "  ;",
    "",
  ].join("\n");
};

export const emitPublicTokens = (
  light: ResolvedToken[],
  dark: ResolvedToken[],
  deprecations: Deprecations = {},
) => {
  const lightByPath = toPathIndex(light);

  const present = (token: ResolvedToken) => {
    const [primary, ...rest] = toDeclarations(token);
    return {
      value: primary?.[1],
      modifiers:
        rest.length === 0
          ? undefined
          : Object.fromEntries(
              rest.map(([name, value]) => [
                name.split("--").pop() ?? name,
                value,
              ]),
            ),
    };
  };

  const entries = dark.map((token) => {
    const lightValue = lightByPath.get(token.path)?.value;
    const varies =
      lightValue !== undefined && !isSameValue(lightValue, token.value);
    const shown = present(token);

    return [
      token.path,
      {
        variable: toVariableName(token.path),
        tier: isPalette(token) ? "primitive" : "semantic",
        dark: shown.value,
        light:
          lightValue === undefined
            ? undefined
            : present({ path: token.path, value: lightValue }).value,
        modifiers: shown.modifiers,
        varies,
        deprecated: deprecations[token.path],
      },
    ] as const;
  });

  return `${JSON.stringify(
    {
      note: "Generated from the token source. Do not edit. Run pnpm --filter @caido/tokens generate.",
      tokens: Object.fromEntries(entries),
    },
    undefined,
    2,
  )}\n`;
};

export const emitValues = (dark: ResolvedToken[]) => {
  const dimensions = dark
    .filter((token) => !token.path.includes("."))
    .filter((token) => isDimensionValue(token.value))
    .flatMap((token) =>
      isDimensionValue(token.value)
        ? [`  ${token.path}: ${token.value.px},`]
        : [],
    );

  const icons = dark
    .filter((token) => token.path.startsWith(`${ICON_ROOT}.`))
    .flatMap((token) =>
      isDimensionValue(token.value)
        ? [`  "${token.path.slice(ICON_ROOT.length + 1)}": ${token.value.px},`]
        : [],
    );

  const steps = dark
    .filter((token) => token.path.startsWith("text."))
    .flatMap((token) => {
      const value = token.value;
      if (!isTypeStepValue(value)) return [];
      const name = token.path.slice("text.".length);
      const weight =
        value.weight === undefined ? "" : `, weight: ${value.weight}`;
      return [
        `  "${name}": { size: ${value.size}, leading: ${value.leading}${weight} },`,
      ];
    });

  const layers = dark
    .filter((token) => token.path.startsWith(`${LAYER_ROOT}.`))
    .flatMap((token) =>
      isLayerValue(token.value)
        ? [
            `  "${token.path.slice(LAYER_ROOT.length + 1)}": ${token.value.index},`,
          ]
        : [],
    );

  return [
    "/* Generated by pnpm --filter @caido/tokens generate. Do not edit. */",
    "",
    "export const dimensions = {",
    ...dimensions,
    "} as const;",
    "",
    "export const typeSteps = {",
    ...steps,
    "} as const;",
    "",
    "export const layers = {",
    ...layers,
    "} as const;",
    "",
    "export const icons = {",
    ...icons,
    "} as const;",
    "",
  ].join("\n");
};

export const appearances: Appearance[] = ["light", "dark"];

export const isSameAppearance = (
  light: ResolvedToken[],
  dark: ResolvedToken[],
) => {
  const darkByPath = toPathIndex(dark);
  return light.every((token) => {
    const counterpart = darkByPath.get(token.path);
    return (
      counterpart !== undefined && isSameValue(token.value, counterpart.value)
    );
  });
};
