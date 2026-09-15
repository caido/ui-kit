import { type ColorValue } from "./resolve.ts";

type Usage = "text" | "large-text" | "identifier" | "focus";

export type Pairing = {
  foreground: string;
  background: string;
  /** The surface the background composites onto, when it is painted at less than full opacity. */
  over?: string;
  /** How much of the background survives the composite, 0 to 1. */
  alpha?: number;
  usage: Usage;
  sites: number;
};

type PairingResult = {
  pairing: Pairing;
  ratio: number;
  required: number;
  passes: boolean;
};

const REQUIRED: Record<Usage, number> = {
  text: 4.5,
  "large-text": 3,
  identifier: 3,
  focus: 3,
};

const toLinearChannel = (value: number) => {
  const scaled = value / 255;
  return scaled <= 0.04045
    ? scaled / 12.92
    : Math.pow((scaled + 0.055) / 1.055, 2.4);
};

const toRgbFromHsl = (value: ColorValue): [number, number, number] => {
  const [hue = 0, saturationPercent = 0, lightnessPercent = 0] =
    value.components;
  const saturation = saturationPercent / 100;
  const lightness = lightnessPercent / 100;

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const sector = (((hue % 360) + 360) % 360) / 60;
  const second = chroma * (1 - Math.abs((sector % 2) - 1));
  const match = lightness - chroma / 2;

  const wheel: [number, number, number][] = [
    [chroma, second, 0],
    [second, chroma, 0],
    [0, chroma, second],
    [0, second, chroma],
    [second, 0, chroma],
    [chroma, 0, second],
  ];

  const [red = 0, green = 0, blue = 0] = wheel[Math.floor(sector) % 6] ?? [
    0, 0, 0,
  ];

  return [
    Math.round((red + match) * 255),
    Math.round((green + match) * 255),
    Math.round((blue + match) * 255),
  ];
};

const toGamma = (channel: number) =>
  channel <= 0.0031308
    ? 12.92 * channel
    : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;

const toRgbFromOklch = (value: ColorValue): [number, number, number] => {
  const [lightness = 0, chroma = 0, hue = 0] = value.components;
  const radians = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(radians);
  const b = chroma * Math.sin(radians);

  const l = Math.pow(lightness + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(lightness - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(lightness - 0.0894841775 * a - 1.291485548 * b, 3);

  const channels: [number, number, number] = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];

  return channels.map((channel) =>
    Math.max(0, Math.min(255, Math.round(toGamma(channel) * 255))),
  ) as [number, number, number];
};

const toRgb = (value: ColorValue): [number, number, number] =>
  value.colorSpace === "oklch" ? toRgbFromOklch(value) : toRgbFromHsl(value);

type Rgb = [number, number, number];

const composite = (value: Rgb, backdrop: Rgb, alpha: number): Rgb => [
  value[0] * alpha + backdrop[0] * (1 - alpha),
  value[1] * alpha + backdrop[1] * (1 - alpha),
  value[2] * alpha + backdrop[2] * (1 - alpha),
];

const getLuminance = ([red, green, blue]: Rgb) =>
  0.2126 * toLinearChannel(red) +
  0.7152 * toLinearChannel(green) +
  0.0722 * toLinearChannel(blue);

const getContrastRatio = (first: Rgb, second: Rgb) => {
  const one = getLuminance(first);
  const other = getLuminance(second);
  const lighter = Math.max(one, other);
  const darker = Math.min(one, other);
  return (lighter + 0.05) / (darker + 0.05);
};

const getRequiredRatio = (usage: Usage) => REQUIRED[usage];

export const checkPairing = (
  pairing: Pairing,
  values: Map<string, ColorValue>,
): PairingResult | undefined => {
  const foreground = values.get(pairing.foreground);
  const background = values.get(pairing.background);
  if (foreground === undefined || background === undefined) return undefined;

  const backdrop =
    pairing.over === undefined ? undefined : values.get(pairing.over);
  if (pairing.over !== undefined && backdrop === undefined) return undefined;

  const resolved =
    backdrop === undefined || pairing.alpha === undefined
      ? toRgb(background)
      : composite(toRgb(background), toRgb(backdrop), pairing.alpha);

  const ratio = getContrastRatio(toRgb(foreground), resolved);
  const required = getRequiredRatio(pairing.usage);

  return {
    pairing,
    ratio,
    required,
    passes: ratio >= required,
  };
};
