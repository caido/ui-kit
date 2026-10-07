import type { Slot, Tone } from "./kit.ts";
import {
  BODY,
  CAPTION,
  GRID,
  RADIUS,
  annotate,
  bare,
  centre,
  code,
  escaped,
  glyph,
  glyphSpan,
  ink,
  markToken,
  note,
  oneLineRow,
  plate,
  region,
  round,
  slotWidth,
  stage,
  staged,
  textWidth,
  tint,
} from "./kit.ts";

const BORDER = 1;

const TAB_PAD_X = round(BODY * 1.125);

const TAB_PAD_Y = GRID * 4;

const TAB_LABEL = GRID * 5;

const TAB_BODY = TAB_PAD_Y * 2 + TAB_LABEL;

const BAND = GRID;

const ROW = TAB_BODY + BAND;

const PANEL = GRID * 12;

const STRIP = GRID * 60;

const CHIP_HEIGHT = GRID * 8;

const CHIP_PAD = GRID * 2;

const ICON_GAP = GRID * 2;

const CLOSE = GRID * 10;

const TOP = GRID * 6;

const STEP = GRID * 5;

const NOTE_STEP = GRID * 7;

const CODE_Y = GRID * 5;

const AXIS = 400;

const tabWidth = (text: string) => round(TAB_PAD_X * 2 + textWidth(text, BODY));

const STORE = tabWidth("Store");

const INSTALLED = tabWidth("Installed");

const TABS = round(STORE + INSTALLED);

export const tabsSpecimens = async (tone: Tone) => {
  const c = (key: string) => tint(tone, key);
  const slidersSpan = await glyphSpan("sliders", CAPTION);
  const xmarkSpan = await glyphSpan("xmark", BODY);
  const chipWidth = round(
    BORDER * 2 +
      CHIP_PAD +
      slidersSpan +
      ICON_GAP +
      textWidth("Session", CAPTION) +
      CHIP_PAD +
      CLOSE,
  );

  const tabLabel = (x: number, y: number, text: string, colour: string) =>
    ink(
      round(x + TAB_PAD_X + textWidth(text, BODY) / 2),
      centre(y + TAB_PAD_Y, TAB_LABEL, BODY),
      text,
      BODY,
      colour,
      { anchor: "middle" },
    );

  const strip = (x: number, y: number, indicator: boolean) =>
    plate(x, y, STRIP, TAB_BODY, { fill: c("raised") }) +
    plate(x, y + TAB_BODY, STRIP, BAND, { fill: c("page") }) +
    plate(x, y + TAB_BODY, STORE, indicator ? BAND : BORDER, {
      fill: indicator ? c("accent") : c("lineSecondary"),
    }) +
    plate(x + STORE, y + TAB_BODY, INSTALLED, BORDER, { fill: c("edge") }) +
    tabLabel(x, y, "Store", c("fgSecondary")) +
    tabLabel(x + STORE, y, "Installed", c("fg"));

  const chip = async (x: number, y: number, selected: boolean) =>
    plate(x, y, chipWidth, CHIP_HEIGHT, {
      stroke: selected ? c("lineSelected") : c("line"),
      radius: RADIUS,
    }) +
    plate(x + BORDER, y + BORDER, chipWidth - BORDER * 2, CHIP_HEIGHT - BORDER * 2, {
      fill: c("page"),
      radius: RADIUS,
    }) +
    (await glyph(
      "sliders",
      round(x + BORDER + CHIP_PAD),
      round(y + (CHIP_HEIGHT - CAPTION) / 2),
      CAPTION,
      c("muted"),
    )) +
    ink(
      round(x + BORDER + CHIP_PAD + slidersSpan + ICON_GAP),
      centre(y + BORDER, CHIP_HEIGHT - BORDER * 2, CAPTION),
      "Session",
      CAPTION,
      c("muted"),
    ) +
    (await glyph(
      "xmark",
      round(x + chipWidth - BORDER - CLOSE / 2 - xmarkSpan / 2),
      round(y + (CHIP_HEIGHT - BODY) / 2),
      BODY,
      c("subtleFg"),
    ));

  const stripX = AXIS - STRIP / 2;

  const anatomyPadX = region(
    tone,
    "padding",
    stripX,
    TOP + TAB_PAD_Y,
    TAB_PAD_X,
    TAB_LABEL,
  );
  const anatomyPadY = region(tone, "padding", stripX, TOP, STORE, TAB_PAD_Y);
  const band = region(
    tone,
    "gap",
    stripX + TABS,
    TOP + TAB_BODY,
    STRIP - TABS,
    BAND,
  );
  const anatomy = bare(
    strip(stripX, TOP, true) +
      plate(stripX, TOP + ROW, STRIP, PANEL, { fill: c("raised") }) +
      ink(stripX, centre(TOP + ROW, PANEL, BODY), "Panel", BODY, c("strong")) +
      anatomyPadX.draw +
      anatomyPadY.draw +
      band.draw,
  );

  const edge = region(tone, "border", stripX, TOP + TAB_BODY, STORE, BORDER);
  const indicator = bare(strip(stripX, TOP, false) + edge.draw + band.draw);

  let restingX = 0;
  let selectedX = 0;
  const chipCaption = (axis: number, y: number, text: string) =>
    code(tone, axis, y + CHIP_HEIGHT + STEP, text, { anchor: "middle" });
  const chipSlots: Slot[] = [
    {
      width: slotWidth(chipWidth, "line-subtle", CAPTION),
      draw: (axis, y) => {
        restingX = round(axis - chipWidth / 2);
        return chipCaption(axis, y, "line-subtle");
      },
    },
    {
      width: slotWidth(chipWidth, "line-selected", CAPTION),
      draw: (axis, y) => {
        selectedX = round(axis - chipWidth / 2);
        return chipCaption(axis, y, "line-selected");
      },
    },
  ];
  const chipCaptions = oneLineRow(chipSlots, AXIS, TOP);
  const chipPad = region(
    tone,
    "padding",
    restingX + BORDER,
    TOP + BORDER,
    CHIP_PAD,
    CHIP_HEIGHT - BORDER * 2,
  );
  const chipRing = region(
    tone,
    "border",
    selectedX,
    TOP,
    chipWidth,
    CHIP_HEIGHT,
  );
  const chips = staged(
    tone,
    (await chip(restingX, TOP, false)) +
      (await chip(selectedX, TOP, true)) +
      chipCaptions +
      chipPad.draw +
      chipRing.draw,
  );

  const doLine = escaped('<CTab :is-selected="active" class="shrink-0" />');
  const dontLine = escaped('<CTabs :items v-model:value class="flex-1" />');
  const doX = round(AXIS - textWidth(doLine, CAPTION) / 2);
  const dontX = round(AXIS - textWidth(dontLine, CAPTION) / 2);
  const dropped = markToken(
    tone,
    "fault",
    dontX,
    CODE_Y,
    dontLine,
    escaped('class="flex-1"'),
  );
  const dont =
    code(tone, dontX, CODE_Y, dontLine) +
    dropped.draw +
    strip(stripX, CODE_Y + STEP, true);

  return {
    "component-tabs-default":
      anatomy.draw +
      annotate(
        tone,
        anatomy.columns,
        "left",
        anatomyPadY,
        anatomyPadY.left.y,
        "py-4 is 16px above and below",
      ) +
      annotate(
        tone,
        anatomy.columns,
        "left",
        anatomyPadX,
        anatomyPadX.left.y,
        "the preset pads 15.75px a side",
      ) +
      annotate(
        tone,
        anatomy.columns,
        "right",
        band,
        band.right.y,
        "border-b-4 is a 4px page band",
      ) +
      note(
        tone,
        anatomy.axis,
        TOP + ROW + PANEL + NOTE_STEP,
        "the indicator bar fills that band under the active tab",
      ),

    "component-tabs-indicator":
      indicator.draw +
      annotate(
        tone,
        indicator.columns,
        "left",
        edge,
        edge.left.y,
        "border-b is 1px line-secondary",
      ) +
      annotate(
        tone,
        indicator.columns,
        "right",
        band,
        band.right.y,
        "the 4px band stays, the bar goes",
      ) +
      note(
        tone,
        indicator.axis,
        TOP + ROW + NOTE_STEP,
        "the underline and the label colour carry it",
      ),

    "component-tabs-chip":
      chips.draw +
      annotate(
        tone,
        chips.columns,
        "left",
        chipPad,
        chipPad.left.y,
        "px-2 pads the label 8px",
      ) +
      annotate(
        tone,
        chips.columns,
        "right",
        chipRing,
        chipRing.right.y,
        "the border is the only change",
        "prose",
      ) +
      note(
        tone,
        chips.axis,
        chips.box.y2 + NOTE_STEP,
        "the close button ships 40px wide, not w-8",
      ),

    "component-tabs-class-do":
      code(tone, doX, CODE_Y, doLine) +
      stage(
        tone,
        await chip(round(AXIS - chipWidth / 2), CODE_Y + STEP + GRID * 2, true),
      ),

    "component-tabs-class-dont": dont,
  };
};
