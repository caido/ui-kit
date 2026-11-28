import { mkdir, writeFile } from "node:fs/promises";

import { buttonSpecimens } from "./specimens/button.ts";
import { cardSpecimens } from "./specimens/card.ts";
import { checkboxSpecimens } from "./specimens/checkbox.ts";
import { dialogSpecimens } from "./specimens/dialog.ts";
import { inputSpecimens } from "./specimens/input.ts";
import type { Appearance, Tone } from "./specimens/kit.ts";
import {
  APPEARANCES,
  BODY,
  BOLD,
  CAPTION,
  CARD_HEIGHT,
  CARD_WIDTH,
  CHECK,
  HEADING,
  MONO,
  PAD,
  RADIUS,
  SANS,
  SPECIMEN_WIDTH,
  TITLE,
  bar,
  button,
  callout,
  centre,
  chip,
  contentBox,
  control,
  disc,
  formGroup,
  glyph,
  hatch,
  ink,
  label,
  medals,
  palette,
  pill,
  plate,
  round,
  row,
  rule,
  snap,
  space,
} from "./specimens/kit.ts";
import { menuSpecimens } from "./specimens/menu.ts";
import { radioSpecimens } from "./specimens/radio.ts";
import { segmentedSpecimens } from "./specimens/segmented.ts";
import { selectSpecimens } from "./specimens/select.ts";
import { tableSpecimens } from "./specimens/table.ts";
import { tabsSpecimens } from "./specimens/tabs.ts";
import { tagSpecimens } from "./specimens/tag.ts";
import { toastSpecimens } from "./specimens/toast.ts";
import { toggleSpecimens } from "./specimens/toggle.ts";

type Sheet = Record<string, string>;

const SPECIMENS: Record<string, (tone: Tone) => Promise<Sheet> | Sheet> = {
  button: buttonSpecimens,
  card: cardSpecimens,
  checkbox: checkboxSpecimens,
  dialog: dialogSpecimens,
  input: inputSpecimens,
  menu: menuSpecimens,
  radio: radioSpecimens,
  segmented: segmentedSpecimens,
  select: selectSpecimens,
  table: tableSpecimens,
  tabs: tabsSpecimens,
  tag: tagSpecimens,
  toast: toastSpecimens,
  toggle: toggleSpecimens,
};

const requested = () => {
  const flag = process.argv
    .slice(2)
    .flatMap((argument) => /^--only=(.+)$/u.exec(argument)?.[1] ?? []);
  const slug = flag[0];
  if (slug === undefined) return undefined;
  if (slug !== "cards" && SPECIMENS[slug] === undefined) {
    throw new Error(
      `unknown target: ${slug} (expected "cards" or one of ${Object.keys(SPECIMENS).join(", ")})`,
    );
  }
  return slug;
};

const only = requested();
const everything = only === undefined;
const cardsOnly = only === "cards";

const OUT = new URL("../docs/public/examples/", import.meta.url);

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

const drawings = (tone: Tone): Record<string, string> => ({
  "float-do":
    bar(40, 0, 130, 8, tone.muted ?? "") +
    bar(40, 14, 130, 8, tone.muted ?? "") +
    bar(40, 28, 130, 8, tone.muted ?? "") +
    bar(40, 42, 130, 8, tone.muted ?? "") +
    bar(40, 56, 130, 8, tone.muted ?? "") +
    bar(40, 70, 130, 8, tone.muted ?? "") +
    bar(40, 84, 130, 8, tone.muted ?? "") +
    `\n  <rect x="56" y="18" width="144" height="60" rx="${RADIUS}" fill="${tone.raised}" stroke="${tone.line}" stroke-width="1"/>` +
    bar(68, 28, 112, 6, tone.muted ?? "") +
    bar(68, 42, 96, 6, tone.muted ?? "") +
    bar(68, 56, 104, 6, tone.muted ?? "") +
    callout({ x: 200, y: 48 }, "the panel ends here", tone.muted ?? ""),
  "float-dont":
    bar(40, 0, 130, 8, tone.muted ?? "") +
    bar(40, 14, 130, 8, tone.muted ?? "") +
    bar(40, 28, 130, 8, tone.muted ?? "") +
    bar(40, 42, 130, 8, tone.muted ?? "") +
    bar(40, 56, 130, 8, tone.muted ?? "") +
    bar(40, 70, 130, 8, tone.muted ?? "") +
    bar(40, 84, 130, 8, tone.muted ?? "") +
    `\n  <rect x="56" y="18" width="144" height="60" rx="${RADIUS}" fill="${tone.raised}"/>` +
    bar(68, 28, 112, 6, tone.muted ?? "") +
    bar(68, 42, 96, 6, tone.muted ?? "") +
    bar(68, 56, 104, 6, tone.muted ?? "") +
    callout({ x: 200, y: 48 }, "the panel ends here", tone.muted ?? ""),

  anatomy:
    hatch("part", tone.accent ?? "") +
    `\n  <rect x="40" y="0" width="200" height="72" rx="${RADIUS}" fill="${tone.raised}"/>` +
    space(40, 0, 200, 16, "part", tone.accent ?? "") +
    space(40, 56, 200, 16, "part", tone.accent ?? "") +
    space(40, 16, 16, 40, "part", tone.accent ?? "") +
    space(224, 16, 16, 40, "part", tone.accent ?? "") +
    bar(56, 16, 110, 12, tone.strong ?? "") +
    hatch("gap", tone.info ?? "") +
    space(56, 28, 168, 8, "gap", tone.info ?? "") +
    bar(56, 36, 168, 8, tone.muted ?? "") +
    bar(56, 48, 140, 8, tone.muted ?? "") +
    callout({ x: 240, y: 8 }, "p-4 card padding", tone.muted ?? "") +
    callout({ x: 240, y: 32 }, "gap-2 between items", tone.muted ?? ""),

  "grouping-do":
    hatch("ok", tone.fgSuccess ?? "") +
    formGroup(tone, 0, 4, 200) +
    space(40, 8, 200, 4, "ok", tone.fgSuccess ?? "") +
    space(40, 40, 200, 16, "ok", tone.fgSuccess ?? "") +
    formGroup(tone, 56, 4, 200) +
    callout({ x: 240, y: 10 }, "gap-1 inside a group", tone.muted ?? "") +
    callout({ x: 240, y: 48 }, "gap-4 between groups", tone.muted ?? ""),
  "grouping-dont":
    hatch("bad", tone.fgDanger ?? "") +
    formGroup(tone, 0, 8, 200) +
    space(40, 8, 200, 8, "bad", tone.fgDanger ?? "") +
    space(40, 44, 200, 8, "bad", tone.fgDanger ?? "") +
    formGroup(tone, 52, 8, 200) +
    callout({ x: 240, y: 12 }, "gap-2 inside a group", tone.muted ?? "") +
    callout({ x: 240, y: 48 }, "gap-2 between groups", tone.muted ?? ""),

  "padding-do":
    hatch("ok", tone.fgSuccess ?? "") +
    control(tone, 0, 6, "ok", tone.fgSuccess ?? "") +
    callout({ x: 240, y: 3 }, "py-1.5 control padding", tone.muted ?? ""),
  "padding-dont":
    hatch("bad", tone.fgDanger ?? "") +
    control(tone, 0, 16, "bad", tone.fgDanger ?? "") +
    callout({ x: 240, y: 8 }, "py-4 a layout rung", tone.muted ?? ""),

  "token-do":
    button(tone.danger ?? "", "Delete", tone.onDanger ?? "") +
    callout({ x: 152, y: 64 }, "fill-danger-strong", tone.muted ?? "") +
    callout({ x: 152, y: 88 }, "fg-on-danger", tone.muted ?? ""),
  "token-dont":
    button("oklch(0.637 0.237 25.331)", "Delete", "#ffffff") +
    callout({ x: 152, y: 64 }, "bg-red-500", tone.muted ?? "") +
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

const cardFrame = (tone: Tone, inner: string) => {
  const box = contentBox(inner);
  const dx = (CARD_WIDTH - (box.x2 - box.x1)) / 2 - box.x1;
  const dy = (CARD_HEIGHT - (box.y2 - box.y1)) / 2 - box.y1;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" role="img">
  <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="${tone.page}"/>
  <g transform="translate(${round(dx)} ${round(dy)})">${inner}
  </g>
</svg>`;
};

const cards = async (tone: Tone) => ({
  "topic-tokens": [0, 1, 2]
    .map((i) => {
      const y = i * 20;
      const name = ["surface-raised", "fill-secondary", "surface-selected"][i] ?? "";
      const fill = [tone.raised, tone.accent, tone.selected][i] ?? "";
      return (
        `\n  <rect x="0" y="${y}" width="12" height="12" rx="3" fill="${fill}" stroke="${tone.edge}" stroke-width="1"/>` +
        label(22, y + 10, name, CAPTION, tone.muted ?? "", MONO)
      );
    })
    .join(""),

  "topic-colour": [tone.primary, tone.accent, tone.success, tone.infoStrong, tone.warn, tone.danger]
    .map((fill, i) => chip(i * 32, 0, 24, fill ?? ""))
    .join(""),

  "topic-type": [CAPTION, BODY, HEADING, TITLE]
    .map((size, i) =>
      label(
        i * 40,
        24,
        "Aa",
        size,
        i < 2 ? (tone.muted ?? "") : (tone.strong ?? ""),
        SANS,
      ),
    )
    .join(""),

  "topic-space":
    [0, 1, 2, 3].map((i) => chip(i * 20, 0, 16, tone.selected ?? "")).join("") +
    [0, 1, 2, 3].map((i) => chip(i * 32, 28, 16, tone.selected ?? "")).join(""),

  "topic-depth":
    pill(0, 0, 64, 44, tone.page ?? "", tone.line) +
    pill(14, 10, 64, 44, tone.subtle ?? "", tone.line) +
    pill(28, 20, 64, 44, tone.raised ?? "", tone.edge),

  "topic-motion":
    pill(0, 6, 180, 4, tone.selected ?? "") +
    chip(0, 0, 16, tone.accent ?? "") +
    pill(0, 34, 180, 4, tone.selected ?? "") +
    chip(140, 28, 16, tone.infoStrong ?? ""),

  "topic-icons":
    (await glyph("bug", 0, 0, 32, tone.muted ?? "")) +
    (await glyph("circle-check", 48, 10, 12, tone.muted ?? "")) +
    (await glyph("magnifying-glass", 76, 10, 12, tone.muted ?? "")) +
    (await glyph("lock", 104, 10, 12, tone.muted ?? "")),

  "topic-states":
    pill(0, 0, 44, 24, tone.raised ?? "", tone.line) +
    pill(56, 0, 44, 24, tone.hover ?? "", tone.line) +
    pill(112, 0, 44, 24, tone.selected ?? "", tone.line) +
    pill(168, 0, 44, 24, tone.raised ?? "", tone.focus),

  "topic-feedback":
    pill(0, 0, 180, 12, tone.selected ?? "") +
    pill(0, 20, 144, 12, tone.selected ?? "") +
    pill(0, 40, 108, 12, tone.selected ?? ""),

  "topic-accessibility":
    pill(0, 0, 44, 28, tone.raised ?? "") +
    label(12, 20, "Aa", BODY, tone.fg ?? "", SANS) +
    label(58, 20, "AA", CAPTION, tone.fgSuccess ?? "", MONO) +
    (await glyph("circle-check", 86, 8, 14, tone.fgSuccess ?? "")),

  "topic-theme":
    pill(0, 0, 90, 44, light.raised ?? "", light.line) +
    label(14, 27, "Light", CAPTION, light.fg ?? "", SANS) +
    pill(96, 0, 90, 44, dark.raised ?? "", dark.line) +
    label(110, 27, "Dark", CAPTION, dark.fg ?? "", SANS),

  "topic-components":
    pill(0, 0, 58, 35, tone.primary ?? "", tone.primary) +
    `\n  <text x="29" y="22.5" text-anchor="middle" font-family="${SANS}" font-size="${BODY}" fill="${tone.onPrimary}">Save</text>` +
    pill(74, 2, 96, 31, tone.page ?? "", tone.edge) +
    `\n  <text x="83" y="22.5" font-family="${SANS}" font-size="${BODY}" fill="${tone.muted}">Hostname</text>` +
    pill(186, 7.5, 20, 20, tone.accent ?? "", tone.accent) +
    `\n  <g transform="translate(189.88 11.38) scale(0.875)"><path d="${CHECK}" fill="${tone.onSecondary}"/></g>` +
    `\n  <rect x="222" y="5.5" width="40" height="24" rx="12" fill="${tone.accent}"/>` +
    `\n  <circle cx="251" cy="17.5" r="8" fill="${tone.onSecondary}"/>`,

  "card-component-button":
    pill(0, 0, 72, 32, tone.primary ?? "", tone.primary) +
    ink(36, centre(0, 32, BODY), "Save", BODY, tone.onPrimary ?? "", {
      anchor: "middle",
    }) +
    pill(88, 0, 80, 32, tone.page ?? "", tone.edge) +
    ink(128, centre(0, 32, BODY), "Cancel", BODY, tone.fg ?? "", {
      anchor: "middle",
    }),

  "card-component-card":
    pill(0, 0, 208, 76, tone.raised ?? "", tone.edge) +
    rule(0, 26, 208, 26, tone.line ?? "") +
    ink(12, 17, "Findings", CAPTION, tone.strong ?? "") +
    bar(12, 38, 184, 6, tone.muted ?? "") +
    bar(12, 52, 148, 6, tone.muted ?? "") +
    bar(12, 64, 100, 6, tone.muted ?? ""),

  "card-component-checkbox":
    plate(0, 0, 20, 20, {
      radius: RADIUS,
      fill: tone.accent ?? "",
      stroke: tone.accent,
    }) +
    `\n  <g transform="translate(3.88 3.88) scale(0.875)"><path d="${CHECK}" fill="${tone.onSecondary}"/></g>` +
    ink(28, centre(0, 20, CAPTION), "Use HTTPS", CAPTION, tone.fg ?? "") +
    plate(124, 0, 20, 20, {
      radius: RADIUS,
      fill: tone.page ?? "",
      stroke: tone.edge,
    }) +
    ink(152, centre(0, 20, CAPTION), "Use static IP", CAPTION, tone.fg ?? ""),

  "card-component-dialog":
    pill(0, 0, 212, 72, tone.raised ?? "", tone.edge) +
    rule(0, 28, 212, 28, tone.line ?? "") +
    ink(12, centre(0, 28, CAPTION), "Delete project", CAPTION, tone.strong ?? "") +
    bar(12, 40, 140, 6, tone.muted ?? "") +
    pill(104, 52, 46, 12, tone.page ?? "", tone.edge) +
    pill(158, 52, 42, 12, tone.danger ?? "", tone.danger),

  "card-component-input":
    ink(0, 10, "Hostname", CAPTION, tone.muted ?? "") +
    pill(0, 18, 208, 32, tone.raised ?? "", tone.edge) +
    ink(12, centre(18, 32, BODY), "example.com", BODY, tone.fg ?? ""),

  "card-component-menu":
    pill(0, 0, 168, 76, tone.raised ?? "", tone.edge) +
    pill(4, 6, 160, 22, tone.hover ?? "") +
    ink(14, 21, "Send to Replay", CAPTION, tone.strong ?? "") +
    ink(14, 45, "Copy URL", CAPTION, tone.fg ?? "") +
    rule(4, 54, 164, 54, tone.line ?? "") +
    ink(14, 69, "Delete", CAPTION, tone.fgDanger ?? ""),

  "card-component-radio":
    disc(10, 10, 9.5, { fill: tone.primary ?? "", stroke: tone.primary }) +
    disc(10, 10, 6, { fill: tone.page ?? "" }) +
    ink(28, centre(0, 20, CAPTION), "HTTP/1", CAPTION, tone.fg ?? "") +
    disc(113, 10, 9.5, { stroke: tone.edge }) +
    ink(131, centre(0, 20, CAPTION), "HTTP/2", CAPTION, tone.fg ?? ""),

  "card-component-segmented":
    pill(0, 0, 176, 28, tone.subtle ?? "", tone.edge) +
    pill(3, 3, 94, 22, tone.raised ?? "", tone.edge) +
    ink(50, centre(3, 22, CAPTION), "Markdown", CAPTION, tone.strong ?? "", {
      anchor: "middle",
    }) +
    ink(136, centre(3, 22, CAPTION), "Raw", CAPTION, tone.muted ?? "", {
      anchor: "middle",
    }),

  "card-component-select":
    ink(0, 10, "Severity", CAPTION, tone.muted ?? "") +
    pill(0, 18, 208, 32, tone.raised ?? "", tone.edge) +
    ink(12, centre(18, 32, BODY), "High", BODY, tone.fg ?? "") +
    (await glyph("chevron-down", 182, 28, 12, tone.muted ?? "")),

  "card-component-table":
    pill(0, 0, 240, 80, tone.raised ?? "", tone.edge) +
    bar(1, 1, 238, 21, tone.subtle ?? "") +
    rule(0, 22, 240, 22, tone.line ?? "") +
    ink(10, centre(0, 22, CAPTION), "Host", CAPTION, tone.muted ?? "") +
    ink(96, centre(0, 22, CAPTION), "Method", CAPTION, tone.muted ?? "") +
    ink(180, centre(0, 22, CAPTION), "Status", CAPTION, tone.muted ?? "") +
    [0, 1, 2]
      .map((i) => {
        const y = 22 + i * 19;
        return (
          (i > 0 ? rule(0, y, 240, y, tone.line ?? "") : "") +
          bar(10, y + 7, 64, 6, tone.muted ?? "") +
          bar(96, y + 7, 40, 6, tone.muted ?? "") +
          bar(180, y + 7, 30, 6, tone.muted ?? "")
        );
      })
      .join(""),

  "card-component-tabs":
    ink(0, 14, "Plugins", CAPTION, tone.strong ?? "") +
    ink(72, 14, "Store", CAPTION, tone.muted ?? "") +
    ink(132, 14, "Settings", CAPTION, tone.muted ?? "") +
    rule(0, 24, 200, 24, tone.line ?? "") +
    rule(0, 24, 52, 24, tone.accent ?? "", { weight: 2 }) +
    bar(0, 36, 200, 6, tone.muted ?? "") +
    bar(0, 50, 160, 6, tone.muted ?? ""),

  "card-component-tag":
    pill(0, 0, 44, 20, tone.infoStrong ?? "", tone.infoStrong) +
    ink(22, centre(0, 20, CAPTION), "200", CAPTION, tone.onInfo ?? "", {
      anchor: "middle",
    }) +
    pill(52, 0, 44, 20, tone.danger ?? "", tone.danger) +
    ink(74, centre(0, 20, CAPTION), "500", CAPTION, tone.onDanger ?? "", {
      anchor: "middle",
    }) +
    pill(104, 0, 52, 20, tone.page ?? "", tone.edge) +
    ink(130, centre(0, 20, CAPTION), "GET", CAPTION, tone.muted ?? "", {
      anchor: "middle",
    }),

  "card-component-toast":
    pill(0, 0, 248, 56, tone.toastDanger ?? "", tone.lineDanger) +
    (await glyph("circle-exclamation", 14, 14, 16, tone.fgDanger ?? "")) +
    ink(42, 26, "Request failed", CAPTION, tone.strong ?? "") +
    ink(42, 44, "Connection refused", CAPTION, tone.muted ?? "") +
    (await glyph("xmark", 222, 14, 14, tone.muted ?? "")),

  "card-component-toggle":
    plate(0, 0, 40, 24, {
      radius: 12,
      fill: tone.subtle ?? "",
      stroke: tone.lineStrong,
    }) +
    disc(13, 12, 8, { fill: tone.fillNeutral ?? "" }) +
    plate(80, 0, 40, 24, { radius: 12, fill: tone.accent ?? "" }) +
    disc(109, 12, 8, { fill: tone.onSecondary ?? "" }),
});

const light = palette("light");
const dark = palette("dark");

await mkdir(OUT, { recursive: true });

let written = 0;

if (everything || cardsOnly) {
  let width = 0;
  for (const appearance of APPEARANCES) {
    for (const inner of Object.values(drawings(palette(appearance)))) {
      const box = contentBox(inner);
      width = Math.max(width, snap(box.x2 - box.x1 + PAD * 2));
    }
  }

  for (const appearance of APPEARANCES) {
    const tone = palette(appearance);
    const all = drawings(tone);

    const heights = new Map<string, number>();
    for (const [name, inner] of Object.entries(all)) {
      const pair = name.replace(/-(do|dont)$/u, "");
      const box = contentBox(inner);
      heights.set(pair, Math.max(heights.get(pair) ?? 0, box.y2 - box.y1));
    }

    if (cardsOnly) break;

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

  for (const appearance of APPEARANCES) {
    const tone = appearance === "light" ? light : dark;
    for (const [name, inner] of Object.entries(await cards(tone))) {
      await writeFile(
        new URL(`${name}-${appearance}.svg`, OUT),
        cardFrame(tone, inner),
      );
      written += 1;
    }
  }
}

const componentDrawings = async (tone: Tone): Promise<Sheet> => {
  const sheet: Sheet = {};
  for (const build of Object.values(SPECIMENS)) {
    Object.assign(sheet, await build(tone));
  }
  return sheet;
};

const owner = (name: string) => name.replace(/^component-/u, "").split("-")[0];

const componentFrame = (
  tone: Tone,
  inner: string,
  frameWidth: number,
  frameHeight: number,
) => {
  const box = contentBox(inner);
  const dx = (frameWidth - (box.x2 - box.x1)) / 2 - box.x1;
  const dy = (frameHeight - (box.y2 - box.y1)) / 2 - box.y1;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${frameWidth} ${frameHeight}" width="${frameWidth}" height="${frameHeight}" role="img">
  <rect width="${frameWidth}" height="${frameHeight}" fill="${tone.page}"/>
  <g transform="translate(${round(dx)} ${round(dy)})">${inner}
  </g>
</svg>`;
};

const specimens = new Map<Appearance, Record<string, string>>();
for (const appearance of APPEARANCES) {
  specimens.set(appearance, await componentDrawings(palette(appearance)));
}

const heights = new Map<string, number>();
const overflowing: string[] = [];
for (const sheet of specimens.values()) {
  for (const [name, inner] of Object.entries(sheet)) {
    const pair = name.replace(/-(do|dont)$/u, "");
    const box = contentBox(inner);
    const wide = snap(box.x2 - box.x1 + PAD * 2);
    if (wide > SPECIMEN_WIDTH && !overflowing.includes(name)) {
      overflowing.push(`${name} needs ${wide}px`);
    }
    heights.set(
      pair,
      Math.max(heights.get(pair) ?? 0, snap(box.y2 - box.y1 + PAD * 2)),
    );
  }
}

if (overflowing.length > 0) {
  throw new Error(
    `past the ${SPECIMEN_WIDTH}px every component specimen shares: ${overflowing.join(
      ", ",
    )}. Wrap the row, shorten the labels or split the specimen in two; never widen the canvas and never shrink the type`,
  );
}

for (const appearance of APPEARANCES) {
  const tone = palette(appearance);
  const sheet = specimens.get(appearance) ?? {};
  for (const [name, inner] of Object.entries(sheet)) {
    if (cardsOnly) continue;
    if (!everything && owner(name) !== only) continue;
    const pair = name.replace(/-(do|dont)$/u, "");
    await writeFile(
      new URL(`${name}-${appearance}.svg`, OUT),
      componentFrame(tone, inner, SPECIMEN_WIDTH, heights.get(pair) ?? 0),
    );
    written += 1;
  }
}

console.log(`wrote ${written} example drawings`);
