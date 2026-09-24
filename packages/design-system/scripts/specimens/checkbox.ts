import type { Point, Tone } from "./kit.ts";
import {
  annotate,
  bare,
  BODY,
  CAPTION,
  centre,
  code,
  GAP,
  glyph,
  glyphSpan,
  GRID,
  ink,
  markToken,
  note,
  oneLineRow,
  plate,
  prose,
  RADIUS,
  region,
  round,
  slotWidth,
  textWidth,
  tint,
  VEIL,
} from "./kit.ts";

const BOX = GRID * 5;
const LABEL_GAP = GRID * 2;
const ROW_STEP = GRID * 8;

const TICK = round(BODY * 0.875);
const INSET = round((BOX - TICK) / 2);
const GLYPH_RATIO = 448 / 512;

const RING = 2;
const RING_OFFSET = 2;
const RING_SPAN = BOX + (RING + RING_OFFSET) * 2;

const ARROW = GRID * 4;

const ABOVE = GRID * 7;
const HIGH = GRID * 8;
const BELOW = GRID * 7;
const NOTE_DROP = GRID * 6;
const CODE_DROP = GRID * 8;
const PROSE_DROP = GRID * 11;

const CAPTION_BASE = round(
  BOX + RING_OFFSET + RING + LABEL_GAP + CAPTION * 0.35,
);

const GAP_LABEL = "gap-2 is 8px to the label";
const CHECKED_LABEL = "fill-secondary paints border and fill";
const ANATOMY_NOTE = "a 20px box, a 1px border and one 6px corner";

const RING_LABEL = "the ring sits 2px outside";
const HOVER_NOTE = "hovering an unchecked box changes nothing";

const BEFORE_LABEL = "the border is line-default";
const AFTER_LABEL = "the border is fill-secondary";
const DASH_NOTE = "the dash is an icon, so its colour holds";

const DO_CODE = 'label="Requests"';
const DONT_CODE = 'label-class="text-caption"';
const DONT_TOKEN = "label-class";
const DO_NOTE = "the component already sets the caption role";
const DONT_LABEL = "the marked name is an attribute, not a prop";

export const checkboxSpecimens = async (tone: Tone) => {
  const c = (key: string) => tint(tone, key);

  const boxAt = (x: number, y: number, fill: string, stroke: string) =>
    plate(x, y, BOX, BOX, { fill, stroke, radius: RADIUS });

  const restBox = (x: number, y: number) => boxAt(x, y, c("page"), c("edge"));

  const checkedBox = (x: number, y: number) =>
    boxAt(x, y, c("accent"), c("accent"));

  const tickAt = (x: number, y: number) =>
    glyph(
      "check",
      round(x + (BOX - round(TICK * GLYPH_RATIO)) / 2),
      y + INSET,
      TICK,
      c("onSecondary"),
    );

  const dashAt = (x: number, y: number) =>
    glyph("minus", x + INSET, round(y + (BOX - BODY) / 2), BODY, c("fg"));

  const labelAt = (x: number, y: number, text: string) =>
    ink(x + BOX + LABEL_GAP, centre(y, BOX, CAPTION), text, CAPTION, c("fg"));

  const veilAt = (x: number, y: number) =>
    plate(x, y, BOX, BOX, {
      fill: c("subtle"),
      opacity: VEIL,
      radius: RADIUS,
    });

  const ringAt = (x: number, y: number) =>
    plate(
      round(x - RING_OFFSET - RING / 2),
      round(y - RING_OFFSET - RING / 2),
      BOX + RING_OFFSET * 2 + RING,
      BOX + RING_OFFSET * 2 + RING,
      { stroke: c("focus"), weight: RING, radius: RADIUS + RING_OFFSET },
    );

  const checkedRow = ROW_STEP;
  const anatomySubject =
    restBox(0, 0) +
    labelAt(0, 0, "Requests") +
    checkedBox(0, checkedRow) +
    (await tickAt(0, checkedRow)) +
    labelAt(0, checkedRow, "Responses");
  const anatomy = bare(anatomySubject);

  const toLabel = region(tone, "gap", BOX, 0, LABEL_GAP, BOX);
  const toLabelTop: Point = { x: round(BOX + LABEL_GAP / 2), y: 0 };
  const checkedEdge = region(tone, "border", 0, checkedRow, BOX, BOX);
  const checkedEdgeFoot: Point = {
    x: round(BOX / 2),
    y: round(checkedRow + BOX + 3),
  };

  const states = [
    { caption: "rest", tick: false, ring: false, veil: false },
    { caption: "hover checked", tick: true, ring: false, veil: false },
    { caption: "focus", tick: true, ring: true, veil: false },
    { caption: "disabled", tick: true, ring: false, veil: true },
  ];

  const paint = (index: number) => {
    if (index === 0) return { fill: c("page"), line: c("edge") };
    if (index === 1) {
      return { fill: c("fillSecondaryHover"), line: c("fillSecondaryHover") };
    }
    return { fill: c("accent"), line: c("accent") };
  };

  const spots: Point[] = [];
  const stateRow = oneLineRow(
    states.map((state, index) => ({
      width: slotWidth(RING_SPAN, state.caption, CAPTION),
      draw: (x: number, y: number) => {
        spots.push({ x, y });
        const left = round(x - BOX / 2);
        const skin = paint(index);
        return (
          (state.ring ? ringAt(left, y) : "") +
          boxAt(left, y, skin.fill, skin.line) +
          (state.veil ? veilAt(left, y) : "") +
          prose(tone, x, round(y + CAPTION_BASE), state.caption, {
            anchor: "middle",
          })
        );
      },
    })),
    0,
    0,
  );

  let stateTicks = "";
  for (const [index, spot] of spots.entries()) {
    if (states[index]?.tick === true) {
      stateTicks += await tickAt(round(spot.x - BOX / 2), spot.y);
    }
  }

  const focusSpot = spots[2] ?? { x: 0, y: 0 };
  const stateGroup = bare(stateRow + stateTicks);

  const ringEdge = region(
    tone,
    "border",
    round(focusSpot.x - RING_SPAN / 2),
    round(focusSpot.y - RING_OFFSET - RING),
    RING_SPAN,
    RING_SPAN,
  );

  const partialLabel = "Collection";
  const partialSpan = round(BOX + LABEL_GAP + textWidth(partialLabel, CAPTION));
  const arrowSpan = await glyphSpan("arrow-right", ARROW);
  const arrowX = round(partialSpan + GAP);
  const afterX = round(arrowX + arrowSpan + GAP);

  const partialSubject =
    restBox(0, 0) +
    (await dashAt(0, 0)) +
    labelAt(0, 0, partialLabel) +
    (await glyph(
      "arrow-right",
      arrowX,
      round((BOX - ARROW) / 2),
      ARROW,
      c("subtleFg"),
    )) +
    checkedBox(afterX, 0) +
    (await dashAt(afterX, 0)) +
    labelAt(afterX, 0, partialLabel);
  const partial = bare(partialSubject);

  const beforeEdge = region(tone, "border", 0, 0, BOX, BOX);
  const afterEdge = region(tone, "border", afterX, 0, BOX, BOX);
  const beforeCrown: Point = { x: round(BOX / 2), y: -3 };
  const afterCrown: Point = { x: round(afterX + BOX / 2), y: -3 };

  const sample = restBox(0, 0) + labelAt(0, 0, "Requests");
  const codeY = BOX + CODE_DROP;
  const doDrawing = sample + code(tone, 0, codeY, DO_CODE);
  const dontDrawing = sample + code(tone, 0, codeY, DONT_CODE);
  const fault = markToken(tone, "fault", 0, codeY, DONT_CODE, DONT_TOKEN);

  return {
    "component-checkbox-default":
      anatomy.draw +
      toLabel.draw +
      checkedEdge.draw +
      annotate(tone, anatomy.columns, "left", toLabelTop, -ABOVE, GAP_LABEL) +
      annotate(
        tone,
        anatomy.columns,
        "right",
        checkedEdgeFoot,
        round(checkedRow + BOX + BELOW),
        CHECKED_LABEL,
        "code",
        "key",
      ) +
      note(
        tone,
        anatomy.axis,
        round(checkedRow + BOX + BELOW + NOTE_DROP),
        ANATOMY_NOTE,
      ),

    "component-checkbox-states":
      stateGroup.draw +
      ringEdge.draw +
      annotate(tone, stateGroup.columns, "left", ringEdge, -HIGH, RING_LABEL) +
      note(tone, stateGroup.axis, round(CAPTION_BASE + GAP), HOVER_NOTE),

    "component-checkbox-indeterminate":
      partial.draw +
      beforeEdge.draw +
      afterEdge.draw +
      annotate(
        tone,
        partial.columns,
        "left",
        beforeCrown,
        -ABOVE,
        BEFORE_LABEL,
      ) +
      annotate(
        tone,
        partial.columns,
        "right",
        afterCrown,
        -ABOVE,
        AFTER_LABEL,
      ) +
      note(tone, partial.axis, round(BOX + NOTE_DROP), DASH_NOTE),

    "component-checkbox-label-do":
      doDrawing + prose(tone, 0, round(codeY + PROSE_DROP), DO_NOTE),

    "component-checkbox-label-dont":
      dontDrawing +
      fault.draw +
      prose(tone, 0, round(codeY + PROSE_DROP), DONT_LABEL),
  };
};
