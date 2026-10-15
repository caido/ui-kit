import { readFile } from "node:fs/promises";

import manifest from "@caido/tokens/tokens.json" with { type: "json" };

export type Appearance = "light" | "dark";

type Entry = {
  variable: string;
  tier: string;
  light?: string;
  dark?: string;
  varies?: boolean;
};

export type Tone = Record<string, string>;

export type Point = { x: number; y: number };

export type Box = { x1: number; y1: number; x2: number; y2: number };

export type Shape = {
  fill?: string;
  stroke?: string;
  weight?: number;
  radius?: number;
  opacity?: number;
  dash?: string;
};

export type Ink = {
  font?: string;
  weight?: number;
  anchor?: string;
  opacity?: number;
};

export const APPEARANCES: Appearance[] = ["light", "dark"];

export const tokens = manifest.tokens as unknown as Record<string, Entry>;

export const CHAR_W = 7.2;

export const raw = (name: string) => {
  const entry = tokens[name];
  if (entry === undefined) throw new Error(`missing token: ${name}`);
  const resolved = entry.light;
  if (resolved === undefined) throw new Error(`missing value: ${name}`);
  return resolved;
};

export const px = (name: string) => {
  const found = /([\d.]+)px/u.exec(raw(name));
  if (found?.[1] === undefined) throw new Error(`not a pixel token: ${name}`);
  return Number(found[1]);
};

export const step = (name: string) => {
  const found = /calc\((\d+)/u.exec(raw(name));
  if (found?.[1] === undefined) throw new Error(`not a type token: ${name}`);
  return Number(found[1]);
};

export const attr = (value: string) => value.replaceAll('"', "&quot;");

export const SANS = attr(raw("font.sans"));

export const MONO = attr(raw("font.mono"));

export const CAPTION = step("text.caption");

export const BODY = step("text.body");

export const HEADING = step("text.heading");

export const TITLE = step("text.title");

export const BOLD = Number(raw("font-weight.bold"));

export const RADIUS = px("radius");

export const GRID = px("spacing");

export const PAD = GRID * 6;

export const LABEL_X = GRID * 62;

export const number = (match: RegExpMatchArray, index: number) => {
  const found = match[index];
  if (found === undefined) throw new Error(`malformed drawing: ${match[0]}`);
  return Number(found);
};

export const string = (match: RegExpMatchArray, index: number) => {
  const found = match[index];
  if (found === undefined) throw new Error(`malformed drawing: ${match[0]}`);
  return found;
};

export const round = (n: number) => Math.round(n * 100) / 100;

export const snap = (n: number) => Math.ceil(n / GRID) * GRID;

export const CARD_WIDTH = 384;

export const CARD_HEIGHT = 96;

export const CARD_CORNER = 3.5;

export const ROW_CORNER = 4;

export const MEDIUM = Number(raw("font-weight.medium"));

export const DISABLED = Number(raw("opacity.disabled"));

export const VEIL = round(1 - DISABLED);

export const DIALOG_SM = px("container.dialog.sm");

export const DIALOG_MD = px("container.dialog.md");

export const DIALOG_LG = px("container.dialog.lg");

export const value = (name: string, appearance: Appearance) => {
  const entry = tokens[name];
  if (entry === undefined) throw new Error(`missing token: ${name}`);
  const resolved = appearance === "light" ? entry.light : entry.dark;
  if (resolved === undefined) {
    throw new Error(`missing ${appearance} value: ${name}`);
  }
  return resolved;
};

export const CATEGORIES = [
  "amber",
  "azure",
  "fern",
  "lime",
  "magenta",
  "rust",
  "teal",
  "violet",
];

export const categoryTones = (appearance: Appearance): Tone =>
  Object.fromEntries(
    CATEGORIES.flatMap((name) =>
      ["fill", "line", "fg"].map((part) => [
        `category-${name}-${part}`,
        value(`color.category.${name}.${part}`, appearance),
      ]),
    ),
  );

export const palette = (appearance: Appearance): Tone => ({
  ...categoryTones(appearance),
  page: value("color.surface.page", appearance),
  fg: value("color.fg.default", appearance),
  muted: value("color.fg.muted", appearance),
  strong: value("color.fg.strong", appearance),
  danger: value("color.fill.danger-strong", appearance),
  onDanger: value("color.fg.on-danger", appearance),
  success: value("color.fill.success-strong", appearance),
  onSuccess: value("color.fg.on-success", appearance),
  fgDanger: value("color.fg.danger", appearance),
  fgSuccess: value("color.fg.success", appearance),
  raised: value("color.surface.raised", appearance),
  subtle: value("color.surface.subtle", appearance),
  line: value("color.line.subtle", appearance),
  accent: value("color.fill.secondary", appearance),
  info: value("color.fill.info", appearance),
  blue: value("color.highlight.blue", appearance),
  green: value("color.highlight.green", appearance),
  red: value("color.highlight.red", appearance),
  gold: value("color.medal.gold", appearance),
  silver: value("color.medal.silver", appearance),
  bronze: value("color.medal.bronze", appearance),
  selected: value("color.surface.selected", appearance),
  hover: value("color.surface.hover", appearance),
  edge: value("color.line.default", appearance),
  focus: value("color.line.focus", appearance),
  primary: value("color.fill.primary", appearance),
  onPrimary: value("color.fg.on-primary", appearance),
  warn: value("color.fill.warn-strong", appearance),
  infoStrong: value("color.fill.info-strong", appearance),
  neutralSubtle: value("color.fill.neutral-subtle", appearance),
  onNeutralSubtle: value("color.fg.on-neutral-subtle", appearance),
  onSecondary: value("color.fg.on-secondary", appearance),
  subtleFg: value("color.fg.subtle", appearance),
  lineStrong: value("color.line.strong", appearance),
  lineSecondary: value("color.line.secondary", appearance),
  lineDanger: value("color.line.danger", appearance),
  lineSuccess: value("color.line.success", appearance),
  lineSelected: value("color.line.selected", appearance),
  fgPrimary: value("color.fg.primary", appearance),
  fgSecondary: value("color.fg.secondary", appearance),
  fgInfoStrong: value("color.fg.info-strong", appearance),
  fgSuccessStrong: value("color.fg.success-strong", appearance),
  fgWarnStrong: value("color.fg.warn-strong", appearance),
  fgDangerStrong: value("color.fg.danger-strong", appearance),
  onInfo: value("color.fg.on-info", appearance),
  onWarn: value("color.fg.on-warn", appearance),
  onNeutral: value("color.fg.on-neutral", appearance),
  fillNeutral: value("color.fill.neutral", appearance),
  fillSecondaryHover: value("color.fill.secondary-hover", appearance),
  surfaceSuccess: value("color.surface.success", appearance),
  surfaceInfo: value("color.surface.info", appearance),
  surfaceWarn: value("color.surface.warn", appearance),
  surfaceDanger: value("color.surface.danger", appearance),
  surfaceDisabled: value("color.surface.disabled", appearance),
  toastInfo: value("color.surface.toast-info", appearance),
  toastSuccess: value("color.surface.toast-success", appearance),
  toastWarn: value("color.surface.toast-warn", appearance),
  toastDanger: value("color.surface.toast-danger", appearance),
  scrim: value("color.fg.strong", "light"),
});

export const textWidth = (text: string, size: number) =>
  round(text.length * (size / 12) * CHAR_W);

export const centre = (y: number, h: number, size: number) => y + h / 2 + size * 0.35;

export const escaped = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export const decoded = (text: string) =>
  text.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&amp;", "&");

export const tint = (tone: Tone, key: string) => tone[key] ?? "";

export const GLYPHS = new URL(
  "../../node_modules/@fortawesome/fontawesome-free/svgs/solid/",
  import.meta.url,
);

export const glyph = async (name: string, x: number, y: number, size: number, colour: string) => {
  const source = await readFile(new URL(`${name}.svg`, GLYPHS), "utf8");
  const view = /viewBox="0 0 (\d+) (\d+)"/u.exec(source);
  const path = /\sd="([^"]+)"/u.exec(source);
  if (view?.[1] === undefined || path?.[1] === undefined) {
    throw new Error(`unreadable glyph: ${name}`);
  }
  const scale = size / Number(view[2]);
  const drawn = Number(view[1]) * scale;
  return `
  <rect x="${round(x)}" y="${round(y)}" width="${round(drawn)}" height="${size}" fill="none"/>
  <path transform="translate(${round(x)} ${round(y)}) scale(${round(scale * 1000) / 1000})" d="${path[1]}" fill="${colour}"/>`;
};

export const glyphSpan = async (name: string, size: number) => {
  const file = await readFile(new URL(`${name}.svg`, GLYPHS), "utf8");
  const view = /viewBox="0 0 (\d+) (\d+)"/u.exec(file);
  if (view?.[1] === undefined || view[2] === undefined) {
    throw new Error(`unreadable glyph: ${name}`);
  }
  return round((Number(view[1]) * size) / Number(view[2]));
};

export const plate = (x: number, y: number, w: number, h: number, shape: Shape) => {
  const parts = [
    `x="${round(x)}"`,
    `y="${round(y)}"`,
    `width="${round(w)}"`,
    `height="${round(h)}"`,
  ];
  if (shape.radius !== undefined) parts.push(`rx="${round(shape.radius)}"`);
  parts.push(`fill="${shape.fill ?? "none"}"`);
  if (shape.stroke !== undefined) {
    parts.push(
      `stroke="${shape.stroke}"`,
      `stroke-width="${shape.weight ?? 1}"`,
    );
  }
  if (shape.dash !== undefined) parts.push(`stroke-dasharray="${shape.dash}"`);
  if (shape.opacity !== undefined) parts.push(`opacity="${shape.opacity}"`);
  return `\n  <rect ${parts.join(" ")}/>`;
};

export const disc = (cx: number, cy: number, r: number, shape: Shape) => {
  const parts = [
    `cx="${round(cx)}"`,
    `cy="${round(cy)}"`,
    `r="${round(r)}"`,
    `fill="${shape.fill ?? "none"}"`,
  ];
  if (shape.stroke !== undefined) {
    parts.push(
      `stroke="${shape.stroke}"`,
      `stroke-width="${shape.weight ?? 1}"`,
    );
  }
  if (shape.opacity !== undefined) parts.push(`opacity="${shape.opacity}"`);
  return `\n  <circle ${parts.join(" ")}/>`;
};

export const ink = (
  x: number,
  y: number,
  text: string,
  size: number,
  colour: string,
  style: Ink = {},
) => {
  const parts = [`x="${round(x)}"`, `y="${round(y)}"`];
  if (style.anchor !== undefined) parts.push(`text-anchor="${style.anchor}"`);
  parts.push(
    `font-family="${style.font ?? SANS}"`,
    `font-size="${round(size)}"`,
  );
  if (style.weight !== undefined) parts.push(`font-weight="${style.weight}"`);
  if (style.opacity !== undefined) parts.push(`opacity="${style.opacity}"`);
  parts.push(`fill="${colour}"`);
  return `\n  <text ${parts.join(" ")}>${text}</text>`;
};

export const rule = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  colour: string,
  style: { weight?: number; dash?: string } = {},
) =>
  `\n  <path d="M ${round(x1)} ${round(y1)} L ${round(x2)} ${round(y2)}" stroke="${colour}" stroke-width="${style.weight ?? 1}"${
    style.dash === undefined ? "" : ` stroke-dasharray="${style.dash}"`
  } fill="none"/>`;

/**
 * Refuses a label that is only a number, with or without its unit (grammar rule G6). A measurement
 * says WHAT it measures: not "2px" but "text has no border: 2px shorter". Every helper that writes
 * a measurement runs its label through this, so a naked number cannot reach the page.
 */
export const named = (text: string) => {
  if (/^[\d.]+\s*(px|rem|em|%)?$/u.test(decoded(text).trim())) {
    throw new Error(
      `"${text}" is a number standing alone: say what it measures, such as "${text} tall" or "the gap is ${text}"`,
    );
  }
  return text;
};

export const mark = (from: Point, to: Point, text: string, colour: string) =>
  disc(from.x, from.y, 2, { fill: colour }) +
  rule(from.x, from.y, to.x, to.y, colour) +
  ink(to.x + 6, to.y + CAPTION * 0.35, named(text), CAPTION, colour, {
    font: MONO,
  });

export const dim = (x: number, y: number, w: number, text: string, colour: string) =>
  rule(x, y, x + w, y, colour) +
  rule(x, y - 3, x, y + 3, colour) +
  rule(x + w, y - 3, x + w, y + 3, colour) +
  ink(x + w / 2, y - 6, named(text), CAPTION, colour, {
    font: MONO,
    anchor: "middle",
  });

export const vdim = (x: number, y: number, h: number, text: string, colour: string) =>
  rule(x, y, x, y + h, colour) +
  rule(x - 3, y, x + 3, y, colour) +
  rule(x - 3, y + h, x + 3, y + h, colour) +
  ink(x + 6, centre(y, h, CAPTION), named(text), CAPTION, colour, {
    font: MONO,
  });

/**
 * How strongly a highlight region is drawn (grammar rule G3). Contrast comes from the HUE, so the
 * role colour is used at full strength and only its opacity is dialled: a region has to be obvious
 * at a glance while the control beside it stays completely readable. Never answer a faint region
 * with a thicker stroke or by covering the control; raise the opacity, which is what these are.
 */
export const WASH = 0.2;

/** The hatch line inside a region: always 1px, never thicker, and always the role colour. */
export const THREAD = 0.5;

/** The 1px dashed outline that closes a region, and the border role's offset ring. */
export const OUTLINE = 0.75;

export const hatch = (id: string, colour: string) => `
  <defs>
    <pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="8" height="8" fill="${colour}" fill-opacity="${WASH}"/>
      <line x1="0" y1="0" x2="0" y2="8" stroke="${colour}" stroke-width="1" stroke-opacity="${THREAD}"/>
    </pattern>
  </defs>`;

export const space = (
  x: number,
  y: number,
  w: number,
  h: number,
  id: string,
  colour: string,
) =>
  `\n  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>` +
  `\n  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${colour}" stroke-width="1" stroke-dasharray="3 2" stroke-opacity="${OUTLINE}"/>`;

export const callout = (from: Point, label: string, colour: string) => `
  <circle cx="${from.x}" cy="${from.y}" r="${RADIUS / 2}" fill="${colour}"/>
  <path d="M ${from.x} ${from.y} L ${LABEL_X} ${from.y}" stroke="${colour}" stroke-width="1" fill="none"/>
  <text x="${LABEL_X + 6}" y="${from.y + 4}" font-family="${MONO}" font-size="${CAPTION}" fill="${colour}">${label}</text>`;

export const contentBox = (inner: string): Box => {
  const box: Box = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };

  const add = (x1: number, y1: number, x2: number, y2: number) => {
    box.x1 = Math.min(box.x1, x1);
    box.y1 = Math.min(box.y1, y1);
    box.x2 = Math.max(box.x2, x2);
    box.y2 = Math.max(box.y2, y2);
  };

  const rects = /<rect x="(-?[\d.]+)" y="(-?[\d.]+)" width="([\d.]+)" height="([\d.]+)"/gu;
  for (const m of inner.matchAll(rects)) {
    add(
      number(m, 1),
      number(m, 2),
      number(m, 1) + number(m, 3),
      number(m, 2) + number(m, 4),
    );
  }

  const circles = /<circle cx="(-?[\d.]+)" cy="(-?[\d.]+)" r="([\d.]+)"/gu;
  for (const m of inner.matchAll(circles)) {
    add(
      number(m, 1) - number(m, 3),
      number(m, 2) - number(m, 3),
      number(m, 1) + number(m, 3),
      number(m, 2) + number(m, 3),
    );
  }

  const texts =
    /<text x="(-?[\d.]+)" y="(-?[\d.]+)"[^>]*font-size="([\d.]+)"[^>]*>([^<]+)</gu;
  for (const m of inner.matchAll(texts)) {
    const size = number(m, 3);
    const width = decoded(string(m, 4)).length * (size / 12) * CHAR_W;
    const anchor = /text-anchor="(middle|end)"/u.exec(m[0])?.[1];
    const drift = anchor === "middle" ? width / 2 : anchor === "end" ? width : 0;
    const x = number(m, 1) - drift;
    add(x, number(m, 2) - size, x + width, number(m, 2) + 3);
  }

  const lines = /<path d="M (-?[\d.]+) (-?[\d.]+) L (-?[\d.]+) (-?[\d.]+)"/gu;
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

export const button = (fill: string, label: string, labelColour: string) => `
  <rect x="40" y="56" width="112" height="40" rx="${RADIUS}" fill="${fill}"/>
  <text x="96" y="${76 + BODY * 0.35}" text-anchor="middle" font-family="${SANS}" font-size="${BODY}" font-weight="${BOLD}" fill="${labelColour}">${label}</text>`;

export const row = (y: number, fill: string, label: string, labelColour: string) => `
  <rect x="40" y="${y}" width="152" height="28" rx="${RADIUS}" fill="${fill}"/>
  <text x="52" y="${y + 14 + CAPTION * 0.35}" font-family="${MONO}" font-size="${CAPTION}" fill="${labelColour}">${label}</text>`;

export const medals = (tone: Tone, withRank: boolean) =>
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

export const bar = (x: number, y: number, w: number, h: number, fill: string) =>
  `\n  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${fill}"/>`;

export const field = (x: number, y: number, w: number, tone: Tone) =>
  `\n  <rect x="${x}" y="${y}" width="${w}" height="28" rx="${RADIUS}" fill="${tone.raised}"/>`;

export const formGroup = (
  tone: Tone,
  y: number,
  labelGap: number,
  width: number,
) => `${bar(40, y, 56, 8, tone.muted ?? "")}${field(40, y + 8 + labelGap, width, tone)}`;

export const control = (
  tone: Tone,
  y: number,
  pad: number,
  id: string,
  colour: string,
) => {
  const height = 20 + pad * 2;
  return (
    `\n  <rect x="40" y="${y}" width="112" height="${height}" rx="${RADIUS}" fill="${tone.raised}"/>` +
    space(40, y, 112, pad, id, colour) +
    space(40, y + height - pad, 112, pad, id, colour) +
    `\n  <text x="96" y="${y + pad + 10 + BODY * 0.35}" text-anchor="middle" font-family="${SANS}" font-size="${BODY}" fill="${tone.strong}">Save</text>`
  );
};

export const chip = (x: number, y: number, size: number, fill: string) =>
  `\n  <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${RADIUS}" fill="${fill}"/>`;

export const pill = (x: number, y: number, w: number, h: number, fill: string, stroke?: string) =>
  `\n  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${RADIUS}" fill="${fill}"${
    stroke === undefined ? "" : ` stroke="${stroke}" stroke-width="1"`
  }/>`;

export const label = (x: number, y: number, text: string, size: number, colour: string, font: string) =>
  `\n  <text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${colour}">${text}</text>`;

export const CHECK =
  "M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z";

/** The four things a callout is ever allowed to point at (grammar rule G3). */
export type Role = "padding" | "gap" | "border" | "fault";

/** Which label column a callout lands in (grammar rule G2). */
export type Side = "left" | "right";

/** Monospace value or class name, versus plain prose (grammar rule G4). */
export type Kind = "code" | "prose";

/** How loud a label is allowed to be (grammar rule G4). */
export type Emphasis = "quiet" | "key" | "accent";

/** The x of each label column, measured from the subject (grammar rule G2). */
export type Columns = { left: number; right: number };

/** A highlighted region: its drawing, and the points a leader line may start from. */
export type Region = {
  draw: string;
  centre: Point;
  left: Point;
  right: Point;
};

/** One item in a centred row: how wide its slot is, and how to draw it about the slot centre. */
export type Slot = { width: number; draw: (centre: number, y: number) => string };

/** The single gap used between row items, between wrapped rows, and around labels. */
export const GAP = GRID * 6;

/** The padding a stage leaves around its subject (grammar rule G1). */
export const STAGE_PAD = GRID * 4;

/** The clear space a row item keeps on each side of its label (grammar rule G5). */
export const CLEAR = GRID * 3;

/** The distance a leader line stops short of the text it points to. */
export const LEADER = GRID * 2;

/** The palette key each region role is drawn in; a colour means one thing everywhere. */
export const ROLE_TONE: Record<Role, string> = {
  padding: "accent",
  gap: "blue",
  border: "green",
  fault: "red",
};

/** Resolves a region role to its palette colour. */
export const roleColour = (tone: Tone, role: Role) => tint(tone, ROLE_TONE[role]);

/** The fill and text colour a control at rest should wear, so it stays legible (grammar rule G1). */
export const resting = (tone: Tone) => ({
  fill: tint(tone, "primary"),
  text: tint(tone, "onPrimary"),
});

/** The bounds of the stage that would sit behind this drawing. */
export const stageBox = (inner: string): Box => {
  const box = contentBox(inner);
  return {
    x1: round(box.x1 - STAGE_PAD),
    y1: round(box.y1 - STAGE_PAD),
    x2: round(box.x2 + STAGE_PAD),
    y2: round(box.y2 + STAGE_PAD),
  };
};

/**
 * Lays a surface-subtle stage behind a subject so a control that would otherwise vanish into the
 * page reads as a layer above it (grammar rule G1).
 *
 * The stage is a TOOL, not a ritual. It exists for one case: a control whose fill sits close to
 * surface.page, such as the default button at fill-neutral-subtle or an outlined field, which
 * disappears without it. A row of coloured severity fills reads perfectly on the page by itself,
 * and a grey slab behind it only adds a box that means nothing.
 *
 * Ask whether THIS subject would be lost. If it would not, draw it with `bare` instead, which hands
 * back the same columns and axis without the slab.
 */
export const stage = (tone: Tone, inner: string) => {
  const box = stageBox(inner);
  return (
    plate(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1, {
      fill: tint(tone, "subtle"),
      radius: RADIUS,
    }) + inner
  );
};

/** How far outside a control's edge the border outline sits, so it never lands on the control (G3). */
export const OFFSET = 3;

/** Draws the region a measurement names, and hands back the points its leader line may start from. */
export const region = (
  tone: Tone,
  role: Role,
  x: number,
  y: number,
  w: number,
  h: number,
): Region => {
  const colour = roleColour(tone, role);
  if (role === "border") {
    const bx = round(x - OFFSET);
    const by = round(y - OFFSET);
    const bw = round(w + OFFSET * 2);
    const bh = round(h + OFFSET * 2);
    const mid = round(by + bh / 2);
    return {
      draw: plate(bx, by, bw, bh, {
        stroke: colour,
        weight: 1,
        dash: "3 2",
        radius: RADIUS + OFFSET,
        opacity: OUTLINE,
      }),
      centre: { x: round(bx + bw / 2), y: by },
      left: { x: bx, y: mid },
      right: { x: round(bx + bw), y: mid },
    };
  }
  const id = `hatch-${role}-${[x, y, w, h]
    .map((n) => round(n))
    .join("-")
    .replaceAll(".", "_")}`;
  const mid = round(y + h / 2);
  return {
    draw: hatch(id, colour) + space(x, y, w, h, id, colour),
    centre: { x: round(x + w / 2), y: mid },
    left: { x: round(x), y: mid },
    right: { x: round(x + w), y: mid },
  };
};

/**
 * The one width EVERY component specimen is emitted at (grammar rule G11). The page renders each
 * drawing class="w-full", so the canvas width alone decides the scale: sizing each drawing to its
 * own content magnified every one by a different amount and made the same 12px label render at
 * 22.9px on one and 18.7px on the next. At a shared 800 the scale settles near 1.06, so CAPTION
 * lands at about 12.7px on every drawing and matches the page's own caption size.
 *
 * A drawing that needs more room is wrapped, shortened or split. It is never widened past this, and
 * the type is never shrunk to fit: the generator fails loudly and names the specimen instead.
 */
export const SPECIMEN_WIDTH = 800;

/** Underlines a token inside a code example, the only legal way to mark code (grammar rule G3). */
export const underline = (
  tone: Tone,
  role: Role,
  x: number,
  y: number,
  w: number,
): Region => {
  const colour = roleColour(tone, role);
  const end = round(x + w);
  return {
    draw: rule(x, y, end, y, colour),
    centre: { x: round(x + w / 2), y: round(y) },
    left: { x: round(x), y: round(y) },
    right: { x: end, y: round(y) },
  };
};

/**
 * Finds a token inside a line of code and underlines just that token, so a leader can start from the
 * end of the underline. This is the only way to mark code; a hatch band over a code line is banned
 * (grammar rule G3). `x` and `y` are the line's own start and baseline.
 */
export const markToken = (
  tone: Tone,
  role: Role,
  x: number,
  y: number,
  line: string,
  token: string,
  size: number = CAPTION,
): Region => {
  const text = decoded(line);
  const needle = decoded(token);
  const index = text.indexOf(needle);
  if (index < 0) throw new Error(`token not in line: ${needle}`);
  return underline(
    tone,
    role,
    round(x + textWidth(text.slice(0, index), size)),
    round(y + size * 0.35),
    textWidth(needle, size),
  );
};

/** The end of a region a leader should leave from, so it runs away from the subject, never across it. */
export const anchor = (spot: Region | Point, side: Side) => {
  if (!("draw" in spot)) return spot;
  return side === "left" ? spot.left : spot.right;
};

/** Places the two label columns either side of the subject, which stays centred between them. */
export const labelColumns = (subject: Box): Columns => ({
  left: round(subject.x1 - GAP),
  right: round(subject.x2 + GAP),
});

/** A staged subject: the drawing with its stage, its bounds, its label columns and its centre axis. */
export type Staged = {
  draw: string;
  box: Box;
  columns: Columns;
  axis: number;
};

/** Stages a subject and hands back everything a callout needs: the columns and the subject axis. */
export const staged = (tone: Tone, subject: string): Staged => {
  const box = stageBox(subject);
  return {
    draw: stage(tone, subject),
    box,
    columns: labelColumns(box),
    axis: round((box.x1 + box.x2) / 2),
  };
};

/**
 * The same thing WITHOUT a stage, for a subject that is already plainly visible on the page
 * (grammar rule G1). Swapping `staged` for `bare` is a one-word change, so dropping a slab that
 * separates nothing costs nothing.
 */
export const bare = (subject: string): Staged => {
  const box = contentBox(subject);
  return {
    draw: subject,
    box,
    columns: labelColumns(box),
    axis: round((box.x1 + box.x2) / 2),
  };
};

/** The ink an emphasis level is written in: quiet and key share fg-muted, only accent is louder (G4). */
export const emphasisInk = (tone: Tone, emphasis: Emphasis) => ({
  colour: emphasis === "accent" ? tint(tone, "accent") : tint(tone, "muted"),
  weight: emphasis === "quiet" ? undefined : MEDIUM,
});

/** A monospace value or class name, in fg-muted, quiet by default (grammar rule G4). */
export const code = (
  tone: Tone,
  x: number,
  y: number,
  text: string,
  style: Ink = {},
) => ink(x, y, text, CAPTION, tint(tone, "muted"), { font: MONO, ...style });

/** A prose caption, in fg-muted, in the sans face, so it never reads as a value. */
export const prose = (
  tone: Tone,
  x: number,
  y: number,
  text: string,
  style: Ink = {},
) => ink(x, y, text, CAPTION, tint(tone, "muted"), { font: SANS, ...style });

/** The one label that matters, lifted by WEIGHT alone and still fg-muted (grammar rule G4). */
export const keyCode = (
  tone: Tone,
  x: number,
  y: number,
  text: string,
  style: Ink = {},
) => code(tone, x, y, text, { weight: MEDIUM, ...style });

/** The same lift for a prose caption: medium weight, still fg-muted. */
export const keyProse = (
  tone: Tone,
  x: number,
  y: number,
  text: string,
  style: Ink = {},
) => prose(tone, x, y, text, { weight: MEDIUM, ...style });

/**
 * The single fill-secondary label a specimen is allowed, and only for the one value it exists to
 * teach (grammar rule G4). Ask for this on purpose; if two labels want it, none of them should have it.
 */
export const accentCode = (
  tone: Tone,
  x: number,
  y: number,
  text: string,
  style: Ink = {},
) =>
  ink(x, y, text, CAPTION, tint(tone, "accent"), {
    font: MONO,
    weight: MEDIUM,
    ...style,
  });

/**
 * The most characters a single annotation label may run to. A label is ONE LINE (grammar rule G11):
 * hand-wrapping one onto a second <text> is what the owner rejected, so this throws instead and the
 * wording gets shortened. At CAPTION this is comfortably inside the 800 canvas.
 */
export const LABEL_MAX = 46;

/**
 * Refuses a label that was wrapped by hand or is too long to sit on one line (grammar rule G11),
 * and a label that is only a number (grammar rule G6).
 */
export const oneLine = (text: string) => {
  named(text);
  if (text.includes("\n")) {
    throw new Error(`a label is one line, never wrapped: ${JSON.stringify(text)}`);
  }
  if (decoded(text).length > LABEL_MAX) {
    throw new Error(
      `label runs ${decoded(text).length} characters, past the ${LABEL_MAX} one line holds: shorten the wording, do not wrap it or shrink it (${text})`,
    );
  }
  return text;
};

/**
 * A leader runs OUT of its region before it runs across: straight up or down from the region edge,
 * then along the label's own line to the column (grammar rule G10). A single diagonal from a region
 * in the middle of a row ploughs through every sibling beside it, which is what a row of states
 * looked like. The elbow keeps the horizontal run on the label's line, clear of the row.
 *
 * When the label already sits on the region's own line there is nothing to step around, so it stays
 * a single straight run.
 */
export const elbow = (from: Point, stop: number, y: number, colour: string) =>
  Math.abs(from.y - y) < 1
    ? rule(from.x, from.y, stop, y, colour)
    : rule(from.x, from.y, from.x, y, colour) + rule(from.x, y, stop, y, colour);

/** Writes a label in the named column and runs a visible fg-muted leader to it (rules G4 and G10). */
export const annotate = (
  tone: Tone,
  columns: Columns,
  side: Side,
  spot: Region | Point,
  y: number,
  text: string,
  kind: Kind = "code",
  emphasis: Emphasis = "quiet",
) => {
  const style = emphasisInk(tone, emphasis);
  const leader = tint(tone, "muted");
  const from = anchor(spot, side);
  oneLine(text);
  const stop = side === "left" ? columns.left + LEADER : columns.right - LEADER;
  return (
    disc(from.x, from.y, 2, { fill: leader }) +
    elbow(from, stop, y, leader) +
    ink(
      side === "left" ? columns.left : columns.right,
      round(y + CAPTION * 0.35),
      text,
      CAPTION,
      style.colour,
      {
        font: kind === "code" ? MONO : SANS,
        anchor: side === "left" ? "end" : "start",
        weight: style.weight,
      },
    )
  );
};

/**
 * A centred prose caption under a subject, for the sentence a specimen ends on. Sans face, fg-muted,
 * CAPTION like every other piece of annotation.
 */
export const note = (tone: Tone, axis: number, y: number, text: string) =>
  prose(tone, axis, y, text, { anchor: "middle" });

/** The width a row item needs: its content, or its label plus 12px of clear space each side. */
export const slotWidth = (content: number, text: string, size: number) =>
  Math.max(content, textWidth(text, size) + CLEAR * 2);

/**
 * The tighter of the two legal row gaps (grammar rule G5). The gap is ONE value from the spacing
 * ladder, the same between every pair: prefer GAP, and drop to this only when it is what lets the
 * whole row sit on one line. There is no third option and no per-pair gap.
 */
export const GAP_TIGHT = GRID * 4;

/**
 * The drawable width a row has to live inside: the shared canvas less its frame padding either side.
 * A row wider than this cannot sit on one line at the shared 800, and the generator says so by name.
 */
export const ROW_BUDGET = SPECIMEN_WIDTH - PAD * 2;

/** How wide a set of items runs when laid out at one even gap. */
export const rowSpan = (items: readonly Slot[], gap: number) =>
  round(
    items.reduce((sum, item) => sum + item.width, 0) +
      gap * Math.max(items.length - 1, 0),
  );

/** Lays items out at one even gap and shifts the whole row to centre on an axis. */
export const evenRow = (
  items: readonly Slot[],
  axis: number,
  y: number,
  gap: number = GAP,
) => {
  let x = axis - rowSpan(items, gap) / 2;
  return items
    .map((item) => {
      const drawn = item.draw(round(x + item.width / 2), y);
      x += item.width + gap;
      return drawn;
    })
    .join("");
};

/**
 * The gap a set of siblings fits on ONE line at, or undefined when even the tight gap overflows.
 * Prefers GAP and only then GAP_TIGHT, which is the whole of the choice grammar rule G5 allows.
 */
export const rowGap = (items: readonly Slot[], budget: number = ROW_BUDGET) => {
  if (rowSpan(items, GAP) <= budget) return GAP;
  if (rowSpan(items, GAP_TIGHT) <= budget) return GAP_TIGHT;
  return undefined;
};

/**
 * Draws a set of siblings on ONE line, centred on the axis, at one even gap (grammar rule G5).
 * This is the helper to reach for: a row that wraps reads as two unrelated groups, which is what
 * the owner rejected when seven button severities came out as a four and a three.
 *
 * It picks GAP, falls back to GAP_TIGHT, and if neither fits it THROWS naming the overflow, because
 * the answer is shorter labels or a split specimen, never a quiet wrap and never smaller type.
 */
export const oneLineRow = (
  items: readonly Slot[],
  axis: number,
  y: number,
  budget: number = ROW_BUDGET,
) => {
  const gap = rowGap(items, budget);
  if (gap === undefined) {
    throw new Error(
      `${items.length} items run ${rowSpan(items, GAP_TIGHT)}px at the ${GAP_TIGHT}px gap, past the ${budget}px one line holds: shorten the labels or split the specimen, do not wrap a set of siblings`,
    );
  }
  return evenRow(items, axis, y, gap);
};

/**
 * Splits items into lines that are as near equal in length as the order allows, so a wrap never
 * leaves a long line above a short one (grammar rule G5).
 */
export const balanced = (items: readonly Slot[], lines: number) => {
  const target = Math.ceil(items.length / lines);
  const out: Slot[][] = [];
  for (let index = 0; index < items.length; index += target) {
    out.push(items.slice(index, index + target));
  }
  return out;
};

/**
 * The last resort for a row that genuinely cannot fit: wraps into balanced lines and centres each
 * one independently, GAP apart (grammar rule G5).
 *
 * It REFUSES to wrap a set that would have fitted on one line, because that is the fault the owner
 * rejected; use `oneLineRow`, which is also what the thrown message says.
 */
export const evenRows = (
  items: readonly Slot[],
  axis: number,
  y: number,
  height: number,
  budget: number = ROW_BUDGET,
) => {
  const gap = rowGap(items, budget);
  if (gap !== undefined) {
    throw new Error(
      `these ${items.length} items fit on one line at a ${gap}px gap, so wrapping them splits one set into two: draw them with oneLineRow`,
    );
  }
  let lines = 2;
  while (
    lines < items.length &&
    balanced(items, lines).some(
      (line) => rowGap(line, budget) === undefined,
    )
  ) {
    lines += 1;
  }
  return balanced(items, lines)
    .map((line, index) =>
      evenRow(line, axis, round(y + index * (height + GAP)), GAP_TIGHT),
    )
    .join("");
};
