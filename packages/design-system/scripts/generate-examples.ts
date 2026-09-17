import { mkdir, writeFile } from "node:fs/promises";

import manifest from "@caido/tokens/tokens.json" with { type: "json" };

type Appearance = "light" | "dark";

type Entry = {
  variable: string;
  tier: string;
  light?: string;
  dark?: string;
  varies?: boolean;
};

type Tone = Record<string, string>;

type Point = { x: number; y: number };

type Box = { x1: number; y1: number; x2: number; y2: number };

const APPEARANCES: Appearance[] = ["light", "dark"];

const tokens = manifest.tokens as unknown as Record<string, Entry>;

const OUT = new URL("../docs/public/examples/", import.meta.url);

const CHAR_W = 7.2;

const raw = (name: string) => {
  const entry = tokens[name];
  if (entry === undefined) throw new Error(`missing token: ${name}`);
  const resolved = entry.light;
  if (resolved === undefined) throw new Error(`missing value: ${name}`);
  return resolved;
};

const px = (name: string) => {
  const found = /([\d.]+)px/u.exec(raw(name));
  if (found?.[1] === undefined) throw new Error(`not a pixel token: ${name}`);
  return Number(found[1]);
};

const step = (name: string) => {
  const found = /calc\((\d+)/u.exec(raw(name));
  if (found?.[1] === undefined) throw new Error(`not a type token: ${name}`);
  return Number(found[1]);
};

const attr = (value: string) => value.replaceAll('"', "&quot;");

const SANS = attr(raw("font.sans"));
const MONO = attr(raw("font.mono"));
const CAPTION = step("text.caption");
const BODY = step("text.body");
const BOLD = Number(raw("font-weight.bold"));
const RADIUS = px("radius");
const GRID = px("spacing");

const PAD = GRID * 6;
const LABEL_X = GRID * 62;

const value = (name: string, appearance: Appearance) => {
  const entry = tokens[name];
  if (entry === undefined) throw new Error(`missing token: ${name}`);
  const resolved = appearance === "light" ? entry.light : entry.dark;
  if (resolved === undefined) {
    throw new Error(`missing ${appearance} value: ${name}`);
  }
  return resolved;
};

const palette = (appearance: Appearance): Tone => ({
  page: value("color.surface.page", appearance),
  fg: value("color.fg.default", appearance),
  muted: value("color.fg.muted", appearance),
  strong: value("color.fg.strong", appearance),
  danger: value("color.fill.danger", appearance),
  onDanger: value("color.fg.on-danger", appearance),
  success: value("color.fill.success", appearance),
  onSuccess: value("color.fg.on-success", appearance),
  fgDanger: value("color.fg.danger", appearance),
  blue: value("color.highlight.blue", appearance),
  green: value("color.highlight.green", appearance),
  red: value("color.highlight.red", appearance),
  gold: value("color.medal.gold", appearance),
  silver: value("color.medal.silver", appearance),
  bronze: value("color.medal.bronze", appearance),
});

const number = (match: RegExpMatchArray, index: number) => {
  const found = match[index];
  if (found === undefined) throw new Error(`malformed drawing: ${match[0]}`);
  return Number(found);
};

const string = (match: RegExpMatchArray, index: number) => {
  const found = match[index];
  if (found === undefined) throw new Error(`malformed drawing: ${match[0]}`);
  return found;
};

const round = (n: number) => Math.round(n * 100) / 100;

const snap = (n: number) => Math.ceil(n / GRID) * GRID;

const callout = (from: Point, label: string, colour: string) => `
  <circle cx="${from.x}" cy="${from.y}" r="${RADIUS / 2}" fill="${colour}"/>
  <path d="M ${from.x} ${from.y} L ${LABEL_X} ${from.y}" stroke="${colour}" stroke-width="1" fill="none"/>
  <text x="${LABEL_X + 6}" y="${from.y + 4}" font-family="${MONO}" font-size="${CAPTION}" fill="${colour}">${label}</text>`;

const contentBox = (inner: string): Box => {
  const box: Box = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };

  const add = (x1: number, y1: number, x2: number, y2: number) => {
    box.x1 = Math.min(box.x1, x1);
    box.y1 = Math.min(box.y1, y1);
    box.x2 = Math.max(box.x2, x2);
    box.y2 = Math.max(box.y2, y2);
  };

  const rects = /<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/gu;
  for (const m of inner.matchAll(rects)) {
    add(
      number(m, 1),
      number(m, 2),
      number(m, 1) + number(m, 3),
      number(m, 2) + number(m, 4),
    );
  }

  const circles = /<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/gu;
  for (const m of inner.matchAll(circles)) {
    add(
      number(m, 1) - number(m, 3),
      number(m, 2) - number(m, 3),
      number(m, 1) + number(m, 3),
      number(m, 2) + number(m, 3),
    );
  }

  const texts = /<text x="([\d.]+)" y="([\d.]+)"[^>]*font-size="([\d.]+)"[^>]*>([^<]+)</gu;
  for (const m of inner.matchAll(texts)) {
    const size = number(m, 3);
    const width = string(m, 4).length * (size / 12) * CHAR_W;
    const centred = /text-anchor="middle"/u.test(m[0]);
    const x = centred ? number(m, 1) - width / 2 : number(m, 1);
    add(x, number(m, 2) - size, x + width, number(m, 2) + 3);
  }

  const lines = /<path d="M ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+)"/gu;
  for (const m of inner.matchAll(lines)) {
    add(
      Math.min(number(m, 1), number(m, 3)),
      Math.min(number(m, 2), number(m, 4)),
      Math.max(number(m, 1), number(m, 3)),
      Math.max(number(m, 2), number(m, 4)),
    );
  }

  return box;
};

const frame = (tone: Tone, inner: string, width: number, height: number) => {
  const box = contentBox(inner);
  const dx = PAD - box.x1;
  const dy = (height - (box.y2 - box.y1)) / 2 - box.y1;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <rect width="${width}" height="${height}" fill="${tone.page}"/>
  <g transform="translate(${round(dx)} ${round(dy)})">${inner}
  </g>
</svg>`;
};

const button = (fill: string, label: string, labelColour: string) => `
  <rect x="40" y="56" width="112" height="40" rx="${RADIUS}" fill="${fill}"/>
  <text x="96" y="${76 + BODY * 0.35}" text-anchor="middle" font-family="${SANS}" font-size="${BODY}" font-weight="${BOLD}" fill="${labelColour}">${label}</text>`;

const row = (y: number, fill: string, label: string, labelColour: string) => `
  <rect x="40" y="${y}" width="152" height="28" rx="${RADIUS}" fill="${fill}"/>
  <text x="52" y="${y + 14 + CAPTION * 0.35}" font-family="${MONO}" font-size="${CAPTION}" fill="${labelColour}">${label}</text>`;

const medals = (tone: Tone, withRank: boolean) =>
  [tone.gold, tone.silver, tone.bronze]
    .map((fill, index) => {
      const y = 48 + index * GRID * 8;
      const disc = `<circle cx="52" cy="${y}" r="8" fill="${fill}"/>`;
      if (!withRank) return disc;
      const rank = ["First", "Second", "Third"][index] ?? "";
      return `${disc}
     <text x="72" y="${y + 5}" font-family="${SANS}" font-size="${BODY}" fill="${tone.fg}">${rank}</text>`;
    })
    .join("");

const drawings = (tone: Tone): Record<string, string> => ({
  "token-do":
    button(tone.danger ?? "", "Delete", tone.onDanger ?? "") +
    callout({ x: 152, y: 64 }, "fill-danger", tone.muted ?? "") +
    callout({ x: 152, y: 88 }, "fg-on-danger", tone.muted ?? ""),
  "token-dont":
    button("#e5484d", "Delete", "#ffffff") +
    callout({ x: 152, y: 64 }, "#e5484d", tone.muted ?? "") +
    callout({ x: 152, y: 88 }, "#ffffff", tone.muted ?? ""),

  "oncolour-do":
    button(tone.success ?? "", "Saved", tone.onSuccess ?? "") +
    callout({ x: 152, y: 76 }, "fg-on-success", tone.muted ?? ""),
  "oncolour-dont":
    button(tone.success ?? "", "Saved", tone.fg ?? "") +
    callout({ x: 152, y: 76 }, "fg-default", tone.muted ?? ""),

  "alone-do":
    `<circle cx="52" cy="80" r="8" fill="${tone.fgDanger}"/>
     <text x="52" y="${80 + CAPTION * 0.35}" text-anchor="middle" font-family="${SANS}" font-size="${CAPTION}" font-weight="${BOLD}" fill="${tone.page}">×</text>
     <text x="68" y="${80 + BODY * 0.35}" font-family="${SANS}" font-size="${BODY}" fill="${tone.fg}">Request failed</text>` +
    callout({ x: 192, y: 80 }, "icon and label", tone.muted ?? ""),
  "alone-dont":
    `<circle cx="52" cy="80" r="8" fill="${tone.fgDanger}"/>` +
    callout({ x: 192, y: 80 }, "colour only", tone.muted ?? ""),

  "accent-do":
    row(48, tone.blue ?? "", "GET /login", tone.strong ?? "") +
    row(88, tone.green ?? "", "GET /admin", tone.strong ?? "") +
    callout({ x: 192, y: 62 }, "highlight-blue", tone.muted ?? "") +
    callout({ x: 192, y: 102 }, "highlight-green", tone.muted ?? ""),
  "accent-dont":
    row(68, tone.red ?? "", "Request failed", tone.strong ?? "") +
    callout({ x: 192, y: 82 }, "highlight-red", tone.muted ?? ""),

  "highlight-do":
    row(68, tone.blue ?? "", "GET /login", tone.strong ?? "") +
    callout({ x: 192, y: 82 }, "fg-strong", tone.muted ?? ""),
  "highlight-dont":
    row(68, tone.blue ?? "", "GET /login", tone.muted ?? "") +
    callout({ x: 192, y: 82 }, "fg-muted", tone.muted ?? ""),

  "medal-do":
    medals(tone, true) +
    callout({ x: 128, y: 80 }, "colour and rank", tone.muted ?? ""),
  "medal-dont":
    medals(tone, false) +
    callout({ x: 128, y: 80 }, "colour only", tone.muted ?? ""),
});

await mkdir(OUT, { recursive: true });

let width = 0;
for (const appearance of APPEARANCES) {
  for (const inner of Object.values(drawings(palette(appearance)))) {
    const box = contentBox(inner);
    width = Math.max(width, snap(box.x2 - box.x1 + PAD * 2));
  }
}

let written = 0;
for (const appearance of APPEARANCES) {
  const tone = palette(appearance);
  const all = drawings(tone);

  const heights = new Map<string, number>();
  for (const [name, inner] of Object.entries(all)) {
    const pair = name.replace(/-(do|dont)$/u, "");
    const box = contentBox(inner);
    heights.set(pair, Math.max(heights.get(pair) ?? 0, box.y2 - box.y1));
  }

  for (const [name, inner] of Object.entries(all)) {
    const pair = name.replace(/-(do|dont)$/u, "");
    const height = snap((heights.get(pair) ?? 0) + PAD * 2);
    await writeFile(
      new URL(`${name}-${appearance}.svg`, OUT),
      frame(tone, inner, width, height),
    );
    written += 1;
  }
}

console.log(`wrote ${written} example drawings`);
