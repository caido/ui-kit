import type { Slot, Tone } from "./kit.ts";
import {
  CAPTION,
  DISABLED,
  GRID,
  OFFSET,
  ROW_BUDGET,
  accentCode,
  annotate,
  code,
  contentBox,
  decoded,
  disc,
  escaped,
  ink,
  labelColumns,
  markToken,
  note,
  oneLineRow,
  plate,
  region,
  round,
  slotWidth,
  textWidth,
  tint,
} from "./kit.ts";

const BOX = GRID * 5;
const DOT = GRID * 3;
const LABEL_GAP = GRID * 2;
const ROW_GAP = GRID * 2;
const BORDER = 1;
const RING = BOX / 2 - BORDER / 2;
const FOCUS_WEIGHT = 2;
const FOCUS_OFFSET = 2;
const FOCUS_RING = BOX / 2 + FOCUS_OFFSET + FOCUS_WEIGHT / 2;
const FOCUS_OUTER = FOCUS_RING + FOCUS_WEIGHT / 2;
const RING_BLEED = FOCUS_OUTER - BOX / 2;

const FIRST = "Horizontal";
const SECOND = "Vertical";

const LEFT = 0;
const FIRST_Y = GRID * 10;
const SECOND_Y = FIRST_Y + BOX + ROW_GAP;
const BETWEEN = round((FIRST_Y + SECOND_Y) / 2);
const ABOVE = FIRST_Y - GRID * 7;
const BELOW = SECOND_Y + GRID * 8;
const CAPTION_Y = round(SECOND_Y + BOX / 2 + GRID * 8 + CAPTION * 0.35);

type State = "rest" | "hover" | "checked" | "disabled";

export const radioSpecimens = (tone: Tone) => {
  const c = (key: string) => tint(tone, key);

  const radio = (cx: number, cy: number, state: State, ring = false) => {
    const body =
      state === "checked"
        ? disc(cx, cy, RING, { fill: c("primary"), stroke: c("primary") }) +
          disc(cx, cy, DOT / 2, { fill: c("page") })
        : state === "disabled"
          ? disc(cx, cy, RING, { fill: c("subtle"), stroke: c("edge") }) +
            disc(cx, cy, DOT / 2, { fill: c("fillNeutral") })
          : disc(cx, cy, RING, {
              stroke: state === "hover" ? c("lineStrong") : c("edge"),
            });
    return ring
      ? body +
          disc(cx, cy, FOCUS_RING, {
            stroke: c("focus"),
            weight: FOCUS_WEIGHT,
          })
      : body;
  };

  const option = (
    x: number,
    cy: number,
    state: State,
    text: string,
    ring = false,
  ) =>
    radio(x + BOX / 2, cy, state, ring) +
    ink(
      x + BOX + LABEL_GAP,
      round(cy + CAPTION * 0.35),
      text,
      CAPTION,
      c("fg"),
      state === "disabled" ? { opacity: DISABLED } : {},
    );

  const rowWidth = (text: string) =>
    round(BOX + LABEL_GAP + textWidth(text, CAPTION));

  const setWidth = Math.max(rowWidth(FIRST), rowWidth(SECOND));
  const axis = round(LEFT + setWidth / 2);

  const set = (second: State, firstRing = false, secondRing = false) =>
    option(LEFT, FIRST_Y, "checked", FIRST, firstRing) +
    option(LEFT, SECOND_Y, second, SECOND, secondRing);

  const aligned = (first: string, second: string) => {
    const a = contentBox(first);
    const b = contentBox(second);
    const x1 = Math.min(a.x1, b.x1);
    const y1 = Math.min(a.y1, b.y1);
    const spacer = plate(
      x1,
      y1,
      round(Math.max(a.x2, b.x2) - x1),
      round(Math.max(a.y2, b.y2) - y1),
      {},
    );
    return [spacer + first, spacer + second] as const;
  };

  const defaults = () => {
    const subject =
      option(LEFT, FIRST_Y, "rest", FIRST) +
      option(LEFT, SECOND_Y, "checked", SECOND);
    const edge = region(tone, "border", LEFT, FIRST_Y - BOX / 2, BOX, BOX);
    const gap = region(
      tone,
      "gap",
      LEFT + BOX,
      SECOND_Y - BOX / 2,
      LABEL_GAP,
      BOX,
    );
    const drawn = subject + edge.draw + gap.draw;
    const columns = labelColumns(contentBox(drawn));

    return (
      drawn +
      annotate(
        tone,
        columns,
        "right",
        edge,
        ABOVE,
        "20px circle with a 1px border",
        "prose",
      ) +
      annotate(
        tone,
        columns,
        "left",
        {
          x: round(LEFT + BOX + LABEL_GAP / 2),
          y: round(SECOND_Y + BOX / 2),
        },
        BELOW,
        "gap-2 puts 8px before the label",
        "prose",
        "key",
      ) +
      note(
        tone,
        axis,
        round(BELOW + GRID * 7),
        "the dot is 12px, and none of these is a prop",
      )
    );
  };

  const states = () => {
    const item = (name: string, state: State, ring = false): Slot => ({
      width: slotWidth(FOCUS_OUTER * 2, name, CAPTION),
      draw: (cx, y) => {
        const cy = round(y + FOCUS_OUTER);
        return (
          radio(cx, cy, state, ring) +
          code(
            tone,
            cx,
            round(y + FOCUS_OUTER * 2 + GRID * 2 + CAPTION * 0.8),
            name,
            { anchor: "middle" },
          )
        );
      },
    });

    const top = GRID * 6;
    const middle = round(ROW_BUDGET / 2);
    const names = round(top + FOCUS_OUTER * 2 + GRID * 2 + CAPTION * 0.8);

    return (
      oneLineRow(
        [
          item("default", "rest"),
          item("hover", "hover"),
          item("focus-visible", "rest", true),
          item("checked", "checked"),
          item("disabled", "disabled"),
        ],
        middle,
        top,
      ) +
      note(
        tone,
        middle,
        round(names + GRID * 7),
        "the interface draws the ring, 2px at a 2px offset",
      )
    );
  };

  const named = () => {
    const doSet = set("rest", true);
    const dontSet = set("rest", true, true);

    const group = region(
      tone,
      "border",
      LEFT - RING_BLEED,
      FIRST_Y - FOCUS_OUTER,
      setWidth + RING_BLEED,
      SECOND_Y + BOX / 2 - (FIRST_Y - FOCUS_OUTER),
    );
    const split = region(
      tone,
      "fault",
      LEFT + BOX / 2 + FOCUS_OUTER + OFFSET,
      FIRST_Y + BOX / 2,
      setWidth - (BOX / 2 + FOCUS_OUTER + OFFSET),
      ROW_GAP,
    );

    const doDrawn =
      doSet +
      group.draw +
      accentCode(tone, axis, CAPTION_Y, 'name="orientation"', {
        anchor: "middle",
      });
    const dontDrawn =
      dontSet + split.draw + note(tone, axis, CAPTION_Y, "no name on either");

    const doColumns = labelColumns(contentBox(doDrawn));
    const dontColumns = labelColumns(contentBox(dontDrawn));

    return aligned(
      doDrawn +
        annotate(
          tone,
          doColumns,
          "right",
          group,
          BETWEEN,
          "one tab stop for the whole set",
          "prose",
        ),
      dontDrawn +
        annotate(
          tone,
          dontColumns,
          "right",
          split,
          BETWEEN,
          "a tab stop for each option",
          "prose",
        ),
    );
  };

  const spacing = () => {
    const subject = set("rest");
    const gap = region(tone, "gap", LEFT, FIRST_Y + BOX / 2, setWidth, ROW_GAP);

    const line = (text: string) =>
      round(axis - textWidth(decoded(text), CAPTION) / 2);

    const stack = escaped('<VStack :gap="2">');
    const margin = 'class="mb-2"';
    const stackX = line(stack);
    const marginX = line(margin);
    const declared = markToken(
      tone,
      "gap",
      stackX,
      CAPTION_Y,
      stack,
      ':gap="2"',
    );
    const dropped = markToken(
      tone,
      "fault",
      marginX,
      CAPTION_Y,
      margin,
      margin,
    );

    const doDrawn =
      subject +
      gap.draw +
      accentCode(tone, stackX, CAPTION_Y, stack) +
      declared.draw;
    const dontDrawn =
      subject +
      gap.draw +
      code(tone, marginX, CAPTION_Y, margin) +
      dropped.draw;

    const doColumns = labelColumns(contentBox(doDrawn));
    const dontColumns = labelColumns(contentBox(dontDrawn));

    return aligned(
      doDrawn +
        annotate(
          tone,
          doColumns,
          "left",
          gap,
          BETWEEN,
          "8px between the two options",
          "prose",
        ) +
        annotate(
          tone,
          doColumns,
          "right",
          declared,
          declared.right.y,
          "set once on the parent stack",
          "prose",
        ),
      dontDrawn +
        annotate(
          tone,
          dontColumns,
          "left",
          gap,
          BETWEEN,
          "nothing moved: this is the stack's gap",
          "prose",
        ) +
        annotate(
          tone,
          dontColumns,
          "right",
          dropped,
          dropped.right.y,
          "dropped in silence, and never lands",
          "prose",
        ),
    );
  };

  const [nameDo, nameDont] = named();
  const [spacingDo, spacingDont] = spacing();

  return {
    "component-radio-default": defaults(),
    "component-radio-states": states(),
    "component-radio-name-do": nameDo,
    "component-radio-name-dont": nameDont,
    "component-radio-spacing-do": spacingDo,
    "component-radio-spacing-dont": spacingDont,
  };
};
