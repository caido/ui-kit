import type { Tone } from "./kit.ts";
import {
  annotate,
  bare,
  BODY,
  CAPTION,
  CARD_CORNER,
  centre,
  code,
  escaped,
  GAP,
  GRID,
  ink,
  markToken,
  oneLineRow,
  plate,
  region,
  slotWidth,
  tint,
} from "./kit.ts";

const HEADER = GRID * 12;
const CUT = GRID;
const RULE = 1;
const FOOTER = GRID * 9;
const INSET = GRID * 4;
const LEADING = GRID * 4;
const TOP = HEADER + CUT;

const CARD_W = GRID * 56;
const CARD_BODY = GRID * 16;
const CARD_H = TOP + CARD_BODY + RULE + FOOTER;

const SLOT_W = GRID * 50;
const SLOT_H = GRID * 32;
const SLOT_CAPTION = SLOT_H + GAP + CAPTION;

const BOX_W = GRID * 60;
const BOX_H = GRID * 32;
const SHORT_H = TOP + INSET * 2 + CAPTION;
const BOX_Y = GRID * 10;
const CODE_Y = CAPTION;
const CODE_LEAD = GRID * 4;

const TITLE_TEXT = "Findings";
const FOOTER_TEXT = "Close";
const BODY_TEXT = "Reflected input";
const SECOND_TEXT = "Open redirect";
const LIST_TEXT = "Reporter list";

const DO_PARENT = '<div class="size-full">';
const DO_CHILD = "  <CCard />";
const DONT_PARENT = "<div>";
const DONT_CHILD = '  <CCard class="size-full" />';
const DONT_TOKEN = 'class="size-full"';

export const cardSpecimens = (tone: Tone) => {
  const c = (key: string) => tint(tone, key);

  const shell = (x: number, y: number, w: number, h: number) =>
    plate(x, y, w, h, { fill: c("raised"), radius: CARD_CORNER });

  const cut = (x: number, y: number, w: number) =>
    plate(x, y + HEADER, w, CUT, { fill: c("page") });

  const hairline = (x: number, y: number, w: number) =>
    plate(x, y, w, RULE, { fill: c("line") });

  const title = (x: number, y: number) =>
    ink(x + INSET, centre(y, HEADER, BODY), TITLE_TEXT, BODY, c("strong"));

  const line = (x: number, y: number, text: string) =>
    ink(x + INSET, y, text, CAPTION, c("muted"));

  const footer = (x: number, y: number, w: number) =>
    hairline(x, y, w) +
    ink(
      x + INSET,
      centre(y, FOOTER, CAPTION),
      FOOTER_TEXT,
      CAPTION,
      c("muted"),
    );

  const bodyTop = (y: number) => y + TOP;

  const firstLine = (y: number) => bodyTop(y) + INSET + CAPTION * 0.9;

  const header = (x: number, y: number, w: number) =>
    cut(x, y, w) + title(x, y);

  const cardArt =
    shell(0, 0, CARD_W, CARD_H) +
    header(0, 0, CARD_W) +
    line(0, firstLine(0), BODY_TEXT) +
    line(0, firstLine(0) + LEADING, SECOND_TEXT) +
    footer(0, TOP + CARD_BODY, CARD_W);

  const card = bare(cardArt);

  const band = region(tone, "padding", 0, 0, CARD_W, HEADER);
  const strip = region(tone, "gap", 0, HEADER, CARD_W, CUT);
  const rule = region(tone, "border", 0, TOP + CARD_BODY, CARD_W, RULE);

  const slots = [
    { text: "<CCard>", header: false, footer: false },
    { text: "#header", header: true, footer: false },
    { text: "#header + #footer", header: true, footer: true },
  ];

  const slotArt = (x: number, y: number, slot: (typeof slots)[number]) => {
    const start = slot.header ? y + TOP : y;
    const ruleY = y + SLOT_H - FOOTER - RULE;
    return (
      shell(x, y, SLOT_W, SLOT_H) +
      (slot.header ? header(x, y, SLOT_W) : "") +
      ink(
        x + INSET,
        start + INSET + CAPTION * 0.9,
        LIST_TEXT,
        CAPTION,
        c("muted"),
      ) +
      (slot.footer ? footer(x, ruleY, SLOT_W) : "")
    );
  };

  const slotRow = oneLineRow(
    slots.map((slot) => ({
      width: slotWidth(SLOT_W, slot.text, CAPTION),
      draw: (centreX: number, y: number) =>
        slotArt(centreX - SLOT_W / 2, y, slot) +
        code(tone, centreX, y + SLOT_CAPTION, escaped(slot.text), {
          anchor: "middle",
        }),
    })),
    0,
    0,
  );

  const snippet = (parent: string, child: string) =>
    code(tone, 0, CODE_Y, escaped(parent)) +
    code(tone, 0, CODE_Y + CODE_LEAD, escaped(child));

  const filled =
    shell(0, BOX_Y, BOX_W, BOX_H) +
    header(0, BOX_Y, BOX_W) +
    line(0, firstLine(BOX_Y), LIST_TEXT);

  const collapsed =
    shell(0, BOX_Y, BOX_W, SHORT_H) +
    header(0, BOX_Y, BOX_W) +
    line(0, firstLine(BOX_Y), LIST_TEXT);

  const parent = region(tone, "border", 0, BOX_Y, BOX_W, BOX_H);

  const rest = region(tone, "padding", 0, BOX_Y + TOP, BOX_W, BOX_H - TOP);

  const missing = region(
    tone,
    "fault",
    0,
    BOX_Y + SHORT_H,
    BOX_W,
    BOX_H - SHORT_H,
  );

  const dropped = markToken(
    tone,
    "fault",
    0,
    CODE_Y + CODE_LEAD,
    DONT_CHILD,
    DONT_TOKEN,
  );

  const doArt = snippet(DO_PARENT, DO_CHILD) + filled + parent.draw;
  const dontArt = snippet(DONT_PARENT, DONT_CHILD) + collapsed + parent.draw;

  const sizing = bare(doArt);

  return {
    "component-card-default":
      card.draw +
      band.draw +
      strip.draw +
      rule.draw +
      annotate(
        tone,
        card.columns,
        "left",
        band,
        HEADER / 2,
        "the header band is a fixed 48px",
        "prose",
      ) +
      annotate(
        tone,
        card.columns,
        "right",
        strip,
        HEADER + CUT / 2,
        "a 4px cut in the page colour",
        "prose",
        "key",
      ) +
      annotate(
        tone,
        card.columns,
        "right",
        rule,
        TOP + CARD_BODY,
        "the footer sits under a 1px rule",
        "prose",
      ),

    "component-card-slots": slotRow,

    "component-card-sizing-do":
      doArt +
      rest.draw +
      annotate(
        tone,
        sizing.columns,
        "left",
        rest,
        BOX_Y + TOP + (BOX_H - TOP) / 2,
        "the body takes the height left",
        "prose",
      ) +
      annotate(
        tone,
        sizing.columns,
        "right",
        parent,
        BOX_Y + BOX_H / 2,
        "the card fills the parent box",
        "prose",
        "key",
      ),

    "component-card-sizing-dont":
      dontArt +
      missing.draw +
      dropped.draw +
      annotate(
        tone,
        sizing.columns,
        "left",
        missing,
        BOX_Y + SHORT_H + (BOX_H - SHORT_H) / 2,
        "it stops at its content height",
        "prose",
      ) +
      annotate(
        tone,
        sizing.columns,
        "right",
        dropped,
        dropped.right.y,
        "the class is dropped silently",
        "prose",
        "key",
      ),
  };
};
