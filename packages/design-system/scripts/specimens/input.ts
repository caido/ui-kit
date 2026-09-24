import type { Columns, Kind, Point, Region, Side, Slot, Tone } from "./kit.ts";
import {
  BODY,
  CAPTION,
  GRID,
  RADIUS,
  VEIL,
  annotate,
  bare,
  centre,
  code,
  contentBox,
  dim,
  escaped,
  ink,
  keyCode,
  keyProse,
  OFFSET,
  oneLineRow,
  plate,
  prose,
  region,
  round,
  slotWidth,
  tint,
} from "./kit.ts";

const BORDER = 1;
const PAD_Y = GRID * 1.5;
const PAD_X = GRID * 2;
const PAD_Y_LARGE = GRID * 3;
const PAD_X_LARGE = GRID * 3.5;
const INNER = 17;
const FIELD_H = INNER + PAD_Y * 2 + BORDER * 2;
const LARGE_H = INNER + PAD_Y_LARGE * 2 + BORDER * 2;
const ROWS = 3;
const ROWS_H = BODY * ROWS + PAD_Y * 2 + BORDER * 2;
const LABEL_LINE = GRID * 5;
const MESSAGE_LINE = GRID * 4;
const FIELD_GAP = GRID;
const DROP = GRID * 4;
const BLOCK_W = GRID * 46;
const CELL_W = GRID * 34;
const STATE_W = GRID * 24;
const SLOT_W = GRID * 56;
const INTRINSIC = 174;
const AXIS = GRID * 94;
const SHORTFALL = `${SLOT_W - INTRINSIC}px of the wrapper stays empty`;
const SLOT_SPAN = `w-56 = ${SLOT_W}px on the wrapper`;

export const inputSpecimens = (tone: Tone) => {
  const c = (key: string) => tint(tone, key);

  const extent = (x: number, y: number, w: number, h: number) =>
    plate(x, y, w, h, {});

  const say = (
    columns: Columns,
    side: Side,
    spot: Region | Point,
    y: number,
    text: string,
    kind: Kind = "code",
  ) => annotate(tone, columns, side, spot, y, text, kind);

  const face = (
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string,
    edge?: string,
  ) => plate(x, y, w, h, { fill, stroke: edge, radius: RADIUS });

  const written = (
    x: number,
    y: number,
    py: number,
    px: number,
    text: string,
    colour: string,
  ) =>
    ink(x + BORDER + px, centre(y + BORDER + py, INNER, BODY), text, BODY, colour);

  const ring = (x: number, y: number, w: number, h: number) =>
    region(tone, "border", x, y, w, h);

  const band = (x: number, y: number, w: number, py: number) =>
    region(tone, "padding", x + BORDER, y + BORDER, w - BORDER * 2, py);

  const matched = (first: string, second: string) => {
    const one = contentBox(first);
    const two = contentBox(second);
    const x1 = Math.min(one.x1, two.x1);
    const y1 = Math.min(one.y1, two.y1);
    const pad = extent(
      x1,
      y1,
      Math.max(one.x2, two.x2) - x1,
      Math.max(one.y2, two.y2) - y1,
    );
    return [first + pad, second + pad] as const;
  };

  const anatomy = () => {
    const top = LABEL_LINE + FIELD_GAP;
    const gap = region(tone, "gap", 0, LABEL_LINE, BLOCK_W, FIELD_GAP);
    const padTop = band(0, top, BLOCK_W, PAD_Y);
    const padLeft = region(
      tone,
      "padding",
      BORDER,
      top + BORDER + PAD_Y,
      PAD_X,
      INNER,
    );
    const edge = ring(0, top, BLOCK_W, FIELD_H);
    const corner = {
      x: edge.right.x,
      y: round(edge.right.y + FIELD_H / 2 + OFFSET),
    };
    const subject =
      face(0, top, BLOCK_W, FIELD_H, c("page"), c("edge")) +
      padTop.draw +
      padLeft.draw +
      edge.draw +
      gap.draw +
      ink(0, centre(0, LABEL_LINE, BODY), "Project name", BODY, c("fg")) +
      written(0, top, PAD_Y, PAD_X, "caido.io", c("strong"));
    const { draw, box, columns, axis } = bare(subject);
    return (
      draw +
      say(columns, "left", gap, gap.centre.y, "gap-1 = 4px above the field") +
      say(
        columns,
        "left",
        padLeft,
        padLeft.centre.y,
        "px-2 = 8px, py-1.5 = 6px inside",
      ) +
      say(columns, "right", corner, corner.y, "rounded-md = 6px corner") +
      say(columns, "right", edge, edge.right.y, "border = 1px line-default") +
      keyCode(tone, axis, box.y2 + DROP, "border-line-default on bg-surface-page", {
        anchor: "middle",
      })
    );
  };

  const sized = (
    caption: string,
    h: number,
    py: number,
    edge: string,
    body: (x: number, y: number) => string,
    keyed: boolean = false,
  ): Slot => ({
    width: slotWidth(CELL_W, caption, CAPTION),
    draw: (middle, y) => {
      const x = round(middle - CELL_W / 2);
      const write = keyed ? keyCode : code;
      return (
        face(x, y, CELL_W, h, c("page"), edge) +
        band(x, y, CELL_W, py).draw +
        body(x, y) +
        write(tone, middle, y + ROWS_H + DROP, caption, { anchor: "middle" })
      );
    },
  });

  const lines = (x: number, y: number) =>
    [0, 1, 2]
      .map((index) =>
        plate(
          x + BORDER + PAD_X,
          y + BORDER + PAD_Y + index * BODY + GRID,
          index === ROWS - 1 ? GRID * 18 : GRID * 28,
          GRID * 1.5,
          { fill: c("muted"), radius: RADIUS },
        ),
      )
      .join("");

  const sizes = () =>
    oneLineRow(
      [
        sized(
          `small py-1.5 = ${FIELD_H}px tall`,
          FIELD_H,
          PAD_Y,
          c("edge"),
          (x, y) => written(x, y, PAD_Y, PAD_X, "caido.io", c("strong")),
          true,
        ),
        sized(
          `large py-3 = ${LARGE_H}px tall`,
          LARGE_H,
          PAD_Y_LARGE,
          c("edge"),
          (x, y) =>
            written(x, y, PAD_Y_LARGE, PAD_X_LARGE, "caido.io", c("strong")),
        ),
        sized(
          `multiline rows=${ROWS} = ${ROWS_H}px tall`,
          ROWS_H,
          PAD_Y,
          c("lineStrong"),
          lines,
        ),
      ],
      AXIS,
      0,
    ) +
    prose(
      tone,
      AXIS,
      ROWS_H + DROP * 2,
      "one line rests on line-default, a textarea on line-strong",
      { anchor: "middle" },
    );

  const state = (
    token: string,
    word: string,
    paint: (x: number, y: number) => string,
    veiled: boolean = false,
  ): Slot => ({
    width: slotWidth(STATE_W, token, CAPTION),
    draw: (middle, y) => {
      const x = round(middle - STATE_W / 2);
      return (
        paint(x, y) +
        written(x, y, PAD_Y, PAD_X, word, c("strong")) +
        (veiled
          ? plate(x, y, STATE_W, FIELD_H, {
              fill: c("page"),
              opacity: VEIL,
              radius: RADIUS,
            })
          : "") +
        code(tone, middle, y + FIELD_H + DROP, token, { anchor: "middle" })
      );
    },
  });

  const states = () =>
    oneLineRow(
      [
        state("line-default", "resting", (x, y) =>
          face(x, y, STATE_W, FIELD_H, c("page"), c("edge")),
        ),
        state("line-strong", "hover", (x, y) =>
          face(x, y, STATE_W, FIELD_H, c("page"), c("lineStrong")),
        ),
        state(
          "line-focus",
          "focus",
          (x, y) =>
            face(x, y, STATE_W, FIELD_H, c("page")) +
            plate(x - BORDER, y - BORDER, STATE_W + BORDER * 2, FIELD_H + BORDER * 2, {
              stroke: c("focus"),
              weight: 2,
              radius: RADIUS + BORDER,
            }),
        ),
        state("line-danger", "invalid", (x, y) =>
          face(x, y, STATE_W, FIELD_H, c("page"), c("lineDanger")),
        ),
        state(
          "surface-disabled",
          "disabled",
          (x, y) => face(x, y, STATE_W, FIELD_H, c("surfaceDisabled"), c("edge")),
          true,
        ),
        state("transparent", "readonly", (x, y) =>
          face(x, y, STATE_W, FIELD_H, c("page")),
        ),
      ],
      AXIS,
      0,
    ) +
    prose(
      tone,
      AXIS,
      FIELD_H + DROP * 2,
      "readonly writes border-transparent, disabled dims the control",
      { anchor: "middle" },
    );

  const messageCell = (edge: string, fault: boolean) => {
    const top = LABEL_LINE + FIELD_GAP;
    const under = top + FIELD_H;
    const gap = region(tone, "gap", 0, under, CELL_W, FIELD_GAP);
    const missing = region(
      tone,
      "fault",
      0,
      under + FIELD_GAP,
      CELL_W,
      MESSAGE_LINE,
    );
    const subject =
      face(0, top, CELL_W, FIELD_H, c("page"), edge) +
      (fault ? missing.draw : gap.draw) +
      ink(0, centre(0, LABEL_LINE, BODY), "Target URL", BODY, c("fg")) +
      written(0, top, PAD_Y, PAD_X, "notaurl", c("strong")) +
      (fault
        ? ""
        : ink(
            0,
            centre(under + FIELD_GAP, MESSAGE_LINE, CAPTION),
            "Enter a valid URL",
            CAPTION,
            c("fgDanger"),
          ));
    return { gap, missing, ...bare(subject) };
  };

  const messageDo = () => {
    const cell = messageCell(c("lineDanger"), false);
    return (
      cell.draw +
      say(
        cell.columns,
        "left",
        cell.gap,
        cell.gap.centre.y,
        "gap-1 = 4px to the message",
      ) +
      prose(
        tone,
        cell.axis,
        cell.box.y2 + DROP,
        "invalid ships the message and the danger border",
        { anchor: "middle" },
      )
    );
  };

  const messageDont = () => {
    const cell = messageCell(c("edge"), true);
    return (
      cell.draw +
      say(
        cell.columns,
        "left",
        cell.missing,
        cell.missing.centre.y,
        "no message reaches the DOM",
        "prose",
      ) +
      keyProse(
        tone,
        cell.axis,
        cell.box.y2 + DROP,
        "message without invalid is dropped",
        { anchor: "middle" },
      )
    );
  };

  const widthCell = (extra: string, top: number) =>
    dim(0, top - DROP, SLOT_W, SLOT_SPAN, c("muted")) + extra;

  const widthDo = () => {
    const top = DROP;
    const reach = ring(0, top, SLOT_W, FIELD_H);
    const subject =
      widthCell(
        face(0, top, SLOT_W, FIELD_H, c("page"), c("edge")) +
          written(0, top, PAD_Y, PAD_X, "caido.io", c("strong")) +
          reach.draw,
        top,
      );
    const { draw, box, columns, axis } = bare(subject);
    return (
      draw +
      say(
        columns,
        "right",
        reach,
        reach.right.y,
        `fluid fills the ${SLOT_W}px wrapper`,
      ) +
      code(
        tone,
        axis,
        box.y2 + DROP,
        escaped('<div class="w-56"> around a fluid field'),
        { anchor: "middle" },
      )
    );
  };

  const widthDont = () => {
    const top = DROP;
    const short = region(
      tone,
      "fault",
      INTRINSIC,
      top,
      SLOT_W - INTRINSIC,
      FIELD_H,
    );
    const subject = widthCell(
      face(0, top, INTRINSIC, FIELD_H, c("page"), c("edge")) +
        written(0, top, PAD_Y, PAD_X, "caido.io", c("strong")) +
        short.draw,
      top,
    );
    const { draw, box, columns, axis } = bare(subject);
    return (
      draw +
      say(columns, "right", short, short.right.y, SHORTFALL) +
      keyCode(
        tone,
        axis,
        box.y2 + DROP,
        escaped('class="w-56" on CInput is filtered out'),
        { anchor: "middle" },
      )
    );
  };

  const [messageOne, messageTwo] = matched(messageDo(), messageDont());
  const [widthOne, widthTwo] = matched(widthDo(), widthDont());

  return {
    "component-input-default": anatomy(),
    "component-input-sizes": sizes(),
    "component-input-states": states(),
    "component-input-message-do": messageOne,
    "component-input-message-dont": messageTwo,
    "component-input-width-do": widthOne,
    "component-input-width-dont": widthTwo,
  };
};
