import { err, ok, type Result } from "neverthrow";

export type ColorValue = {
  colorSpace: string;
  components: number[];
  alpha?: number;
};

type TypeStepValue = {
  size: number;
  leading: number;
  weight?: number;
};

type FontFamilyValue = {
  stack: string[];
};

type FontWeightValue = {
  weight: number;
};

type MeasureValue = {
  ch: number;
};

type DimensionValue = {
  px: number;
};

type LayerValue = {
  index: number;
};

type DurationValue = {
  ms: number;
};

type EasingValue = {
  curve: number[];
};

type AmountValue = {
  amount: number;
};

export type TokenValue =
  | ColorValue
  | TypeStepValue
  | FontFamilyValue
  | FontWeightValue
  | MeasureValue
  | DimensionValue
  | LayerValue
  | DurationValue
  | EasingValue
  | AmountValue;

export type ResolvedToken = {
  path: string;
  value: TokenValue;
};

export type Appearance = "light" | "dark";

const isRecord = (node: unknown): node is Record<string, unknown> =>
  typeof node === "object" && node !== null && !Array.isArray(node);

export const isColorValue = (value: unknown): value is ColorValue =>
  isRecord(value) &&
  typeof value.colorSpace === "string" &&
  Array.isArray(value.components) &&
  value.components.every((component) => typeof component === "number");

export const isTypeStepValue = (value: unknown): value is TypeStepValue =>
  isRecord(value) &&
  typeof value.size === "number" &&
  typeof value.leading === "number" &&
  (value.weight === undefined || typeof value.weight === "number");

export const isFontFamilyValue = (value: unknown): value is FontFamilyValue =>
  isRecord(value) &&
  Array.isArray(value.stack) &&
  value.stack.length > 0 &&
  value.stack.every((face) => typeof face === "string");

export const isFontWeightValue = (value: unknown): value is FontWeightValue =>
  isRecord(value) && typeof value.weight === "number";

export const isMeasureValue = (value: unknown): value is MeasureValue =>
  isRecord(value) && typeof value.ch === "number";

export const isDimensionValue = (value: unknown): value is DimensionValue =>
  isRecord(value) && typeof value.px === "number";

export const isLayerValue = (value: unknown): value is LayerValue =>
  isRecord(value) && typeof value.index === "number";

export const isDurationValue = (value: unknown): value is DurationValue =>
  isRecord(value) && typeof value.ms === "number";

export const isEasingValue = (value: unknown): value is EasingValue =>
  isRecord(value) &&
  Array.isArray(value.curve) &&
  value.curve.length === 4 &&
  value.curve.every((point) => typeof point === "number");

export const isAmountValue = (value: unknown): value is AmountValue =>
  isRecord(value) && typeof value.amount === "number";

const isTokenValue = (value: unknown): value is TokenValue =>
  isColorValue(value) ||
  isTypeStepValue(value) ||
  isFontFamilyValue(value) ||
  isFontWeightValue(value) ||
  isMeasureValue(value) ||
  isDimensionValue(value) ||
  isLayerValue(value) ||
  isDurationValue(value) ||
  isEasingValue(value) ||
  isAmountValue(value);

const isAlias = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith("{") && value.endsWith("}");

const toAliasTarget = (value: string) => value.slice(1, -1);

const flatten = (
  node: unknown,
  prefix: string[],
  into: Map<string, unknown>,
) => {
  if (!isRecord(node)) return;

  if ("$value" in node) {
    into.set(prefix.join("."), node.$value);
    return;
  }

  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    flatten(child, [...prefix, key], into);
  }
};

export const flattenTokens = (documents: unknown[]) => {
  const flat = new Map<string, unknown>();
  for (const document of documents) flatten(document, [], flat);
  return flat;
};

export const resolveTokens = (
  flat: Map<string, unknown>,
): Result<ResolvedToken[], string> => {
  const resolved: ResolvedToken[] = [];

  for (const [path, raw] of flat) {
    const seen: string[] = [path];
    let value = raw;

    while (isAlias(value)) {
      const target = toAliasTarget(value);
      if (seen.includes(target)) {
        return err(`circular alias: ${[...seen, target].join(" -> ")}`);
      }
      const next = flat.get(target);
      if (next === undefined) {
        return err(`${path} points at ${target}, which does not exist`);
      }
      seen.push(target);
      value = next;
    }

    if (!isTokenValue(value)) {
      return err(`${path} does not hold a value this system can emit`);
    }

    resolved.push({ path, value });
  }

  return ok(resolved);
};
