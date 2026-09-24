import type { Slot, Tone } from "./kit.ts";
import {
  BODY,
  CAPTION,
  GRID,
  RADIUS,
  VEIL,
  accentCode,
  annotate,
  bare,
  centre,
  code,
  contentBox,
  escaped,
  glyph,
  ink,
  keyCode,
  note,
  oneLineRow,
  plate,
  region,
  round,
  slotWidth,
  staged,
  tint,
} from "./kit.ts";

const BORDER = 1;

const PAD_Y = GRID * 1.5;

const PAD_X = GRID * 2;

const INNER = 17;

const TRIGGER_H = INNER + PAD_Y * 2 + BORDER * 2;

const MULTI_INNER = 20;

const MULTI_H = MULTI_INNER + PAD_Y * 2 + BORDER * 2;

const ICON = BODY;

const ICON_PAD_LEFT = GRID;

const ICON_PAD_RIGHT = GRID * 3;

const BLOCK_W = ICON + ICON_PAD_LEFT + ICON_PAD_RIGHT;

const MULTI_BLOCK_W = GRID * 12;

const TRIGGER_W = GRID * 50;

const LABEL_LINE = GRID * 5;

const FIELD_GAP = GRID;

const MESSAGE_LINE = GRID * 4;

const LIST_PAD = GRID;

const ROW_PAD_X = GRID * 3;

const ROW_PAD_Y = GRID * 2;

const ROW_H = BODY + ROW_PAD_Y * 2;

const LIST_GAP = 2;

const ROW_MARGIN = 2;

const ROW_STEP = LIST_GAP + ROW_MARGIN;

const OVERLAY_H = BORDER * 2 + LIST_PAD * 2 + ROW_H * 3 + ROW_STEP * 2;

const TOP = LABEL_LINE + FIELD_GAP;

const DROP = GRID * 4;

const STEP = GRID * 5;

const LIFT = GRID * 3;

const AXIS = GRID * 94;

export const selectSpecimens = async (tone: Tone) => {
  const c = (key: string) => tint(tone, key);

  const chevron = (x: number, y: number, size: number = ICON) =>
    glyph("chevron-down", x, y, size, c("muted"));

  const face = (
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string,
    edge: string,
  ) => plate(x, y, w, h, { fill, stroke: edge, radius: RADIUS });

  const written = (
    x: number,
    y: number,
    h: number,
    text: string,
    colour: string,
  ) => ink(x + BORDER + PAD_X, centre(y, h, BODY), text, BODY, colour);

  const veil = (x: number, y: number, w: number, h: number) =>
    plate(x, y, w, h, { fill: c("page"), opacity: VEIL, radius: RADIUS });

  const blockX = (x: number, w: number, block: number) =>
    round(x + w - BORDER - block);

  const iconY = (y: number, h: number) => round(y + (h - ICON) / 2);

  const matched = (first: string, second: string) => {
    const one = contentBox(first);
    const two = contentBox(second);
    const x1 = Math.min(one.x1, two.x1);
    const y1 = Math.min(one.y1, two.y1);
    const pad = plate(
      x1,
      y1,
      Math.max(one.x2, two.x2) - x1,
      Math.max(one.y2, two.y2) - y1,
      {},
    );
    return [first + pad, second + pad] as const;
  };

  const anatomy = async () => {
    const gap = region(tone, "gap", 0, LABEL_LINE, TRIGGER_W, FIELD_GAP);
    const inset = region(
      tone,
      "padding",
      BORDER,
      TOP + BORDER + PAD_Y,
      PAD_X,
      INNER,
    );
    const start = blockX(0, TRIGGER_W, BLOCK_W);
    const block = region(
      tone,
      "padding",
      start,
      TOP + BORDER,
      BLOCK_W,
      TRIGGER_H - BORDER * 2,
    );
    const subject =
      ink(0, centre(0, LABEL_LINE, BODY), "Project", BODY, c("fg")) +
      face(0, TOP, TRIGGER_W, TRIGGER_H, c("page"), c("lineStrong")) +
      written(0, TOP, TRIGGER_H, "Alpha", c("strong")) +
      (await chevron(start + ICON_PAD_LEFT, iconY(TOP, TRIGGER_H))) +
      gap.draw +
      inset.draw +
      block.draw;
    const { draw, box, columns, axis } = bare(subject);
    return (
      draw +
      annotate(
        tone,
        columns,
        "left",
        gap,
        gap.centre.y,
        "gap-1 = 4px above the control",
        "code",
        "accent",
      ) +
      annotate(
        tone,
        columns,
        "left",
        inset,
        inset.centre.y,
        "pl-2 = 8px before the value",
      ) +
      annotate(
        tone,
        columns,
        "right",
        block,
        block.right.y,
        "pl-1 pr-3 = a 30px chevron block",
      ) +
      note(
        tone,
        axis,
        box.y2 + STEP,
        "hideLabel keeps the label and drops the gap",
      )
    );
  };

  const values = async () => {
    const cells = [
      { text: "Alpha", colour: c("strong"), caption: "value: fg-strong", off: false },
      {
        text: "Select a plugin",
        colour: c("muted"),
        caption: "placeholder: fg-muted",
        off: false,
      },
      {
        text: "Alpha",
        colour: c("strong"),
        caption: "disabled: surface-disabled",
        off: true,
      },
    ];
    const widths = cells.map((cell) =>
      slotWidth(TRIGGER_W, cell.caption, CAPTION),
    );
    const icons: number[] = [];
    const veils: string[] = [];
    const cellSlots: Slot[] = cells.map((cell, index) => ({
      width: widths[index] ?? TRIGGER_W,
      draw: (middle, y) => {
        const x = round(middle - TRIGGER_W / 2);
        icons.push(blockX(x, TRIGGER_W, BLOCK_W) + ICON_PAD_LEFT);
        if (cell.off) veils.push(veil(x, y, TRIGGER_W, TRIGGER_H));
        return (
          face(
            x,
            y,
            TRIGGER_W,
            TRIGGER_H,
            cell.off ? c("surfaceDisabled") : c("page"),
            c("lineStrong"),
          ) + written(x, y, TRIGGER_H, cell.text, cell.colour)
        );
      },
    }));
    const triggers = oneLineRow(cellSlots, AXIS, 0);
    const drawn = await Promise.all(
      icons.map((x) => chevron(x, iconY(0, TRIGGER_H))),
    );
    const { draw, box, axis } = staged(
      tone,
      triggers + drawn.join("") + veils.join(""),
    );
    const captionY = round(box.y2 + DROP);
    const captions = oneLineRow(
      cells.map((cell, index) => ({
        width: widths[index] ?? TRIGGER_W,
        draw: (middle: number) =>
          cell.caption.startsWith("placeholder")
            ? accentCode(tone, middle, captionY, cell.caption, {
                anchor: "middle",
              })
            : code(tone, middle, captionY, cell.caption, { anchor: "middle" }),
      })),
      AXIS,
      captionY,
    );
    return (
      draw +
      captions +
      note(
        tone,
        axis,
        captionY + STEP,
        "no value and no placeholder leaves a space",
      )
    );
  };

  const open = async () => {
    const listTop = TRIGGER_H;
    const rowX = BORDER + LIST_PAD;
    const rowW = TRIGGER_W - (BORDER + LIST_PAD) * 2;
    const rowY = (index: number) =>
      round(listTop + BORDER + LIST_PAD + index * (ROW_H + ROW_STEP));
    const option = (index: number, text: string, fill?: string) =>
      (fill === undefined
        ? ""
        : plate(rowX, rowY(index), rowW, ROW_H, { fill, radius: RADIUS })) +
      ink(
        rowX + ROW_PAD_X,
        centre(rowY(index), ROW_H, BODY),
        text,
        BODY,
        fill === c("selected") ? c("strong") : c("fg"),
      );
    const inset = region(
      tone,
      "padding",
      rowX,
      rowY(0),
      ROW_PAD_X,
      ROW_H,
    );
    const between = region(
      tone,
      "gap",
      rowX,
      round(rowY(1) + ROW_H),
      rowW,
      ROW_STEP,
    );
    const picked = { x: round(rowX + rowW), y: round(rowY(1) + ROW_H / 2) };
    const focused = { x: round(rowX + rowW), y: round(rowY(2) + ROW_H / 2) };
    const subject =
      face(0, 0, TRIGGER_W, TRIGGER_H, c("page"), c("lineStrong")) +
      written(0, 0, TRIGGER_H, "Beta", c("strong")) +
      (await chevron(
        blockX(0, TRIGGER_W, BLOCK_W) + ICON_PAD_LEFT,
        iconY(0, TRIGGER_H),
      )) +
      face(0, listTop, TRIGGER_W, OVERLAY_H, c("page"), c("edge")) +
      option(0, "Alpha") +
      option(1, "Beta", c("selected")) +
      option(2, "Gamma", c("hover")) +
      inset.draw +
      between.draw;
    const { draw, box, columns, axis } = bare(subject);
    return (
      draw +
      annotate(
        tone,
        columns,
        "left",
        inset,
        inset.centre.y,
        "px-3 insets the option text",
      ) +
      annotate(
        tone,
        columns,
        "left",
        between,
        between.centre.y,
        "4px between rows, from two preset rules",
        "prose",
      ) +
      annotate(
        tone,
        columns,
        "right",
        picked,
        picked.y,
        "surface-selected is the value",
        "code",
        "accent",
      ) +
      annotate(
        tone,
        columns,
        "right",
        focused,
        focused.y,
        "surface-hover is keyboard focus",
      ) +
      note(
        tone,
        axis,
        box.y2 + STEP,
        "the library checkmark is never asked for",
      )
    );
  };

  const branches = async () => {
    const multiTop = TRIGGER_H + DROP + LIFT;
    const singleBlock = blockX(0, TRIGGER_W, BLOCK_W);
    const multiBlock = blockX(0, TRIGGER_W, MULTI_BLOCK_W);
    const singleRing = region(tone, "border", 0, 0, TRIGGER_W, TRIGGER_H);
    const multiRing = region(
      tone,
      "border",
      0,
      multiTop,
      TRIGGER_W,
      MULTI_H,
    );
    const singleChevron = region(
      tone,
      "padding",
      singleBlock,
      BORDER,
      BLOCK_W,
      TRIGGER_H - BORDER * 2,
    );
    const multiChevron = region(
      tone,
      "padding",
      multiBlock,
      multiTop + BORDER,
      MULTI_BLOCK_W,
      MULTI_H - BORDER * 2,
    );
    const subject =
      face(0, 0, TRIGGER_W, TRIGGER_H, c("page"), c("lineStrong")) +
      written(0, 0, TRIGGER_H, "Alpha", c("strong")) +
      (await chevron(singleBlock + ICON_PAD_LEFT, iconY(0, TRIGGER_H))) +
      face(0, multiTop, TRIGGER_W, MULTI_H, c("page"), c("lineDanger")) +
      written(0, multiTop, MULTI_H, "Alpha, Beta", c("strong")) +
      (await chevron(
        round(multiBlock + (MULTI_BLOCK_W - ICON) / 2),
        iconY(multiTop, MULTI_H),
      )) +
      singleRing.draw +
      multiRing.draw +
      singleChevron.draw +
      multiChevron.draw;
    const { draw, box, columns, axis } = bare(subject);
    return (
      draw +
      annotate(
        tone,
        columns,
        "left",
        singleRing,
        singleRing.left.y,
        "invalid keeps line-strong here",
      ) +
      annotate(
        tone,
        columns,
        "left",
        multiRing,
        multiRing.left.y,
        "invalid = line-danger on multiple",
        "code",
        "key",
      ) +
      annotate(
        tone,
        columns,
        "right",
        singleChevron,
        singleChevron.right.y,
        "single: 31px tall, 30px block",
        "prose",
      ) +
      annotate(
        tone,
        columns,
        "right",
        multiChevron,
        multiChevron.right.y,
        "multiple: 34px tall, 48px block",
        "prose",
      ) +
      note(
        tone,
        axis,
        box.y2 + STEP,
        "no screen in the interface sets multiple",
      )
    );
  };

  const messageDo = async () => {
    const under = TOP + TRIGGER_H;
    const gap = region(tone, "gap", 0, under, TRIGGER_W, FIELD_GAP);
    const subject =
      ink(0, centre(0, LABEL_LINE, BODY), "Region", BODY, c("fg")) +
      face(0, TOP, TRIGGER_W, TRIGGER_H, c("page"), c("lineStrong")) +
      written(0, TOP, TRIGGER_H, "Choose", c("muted")) +
      (await chevron(
        blockX(0, TRIGGER_W, BLOCK_W) + ICON_PAD_LEFT,
        iconY(TOP, TRIGGER_H),
      )) +
      gap.draw +
      ink(
        0,
        centre(under + FIELD_GAP, MESSAGE_LINE, CAPTION),
        "Choose a region",
        CAPTION,
        c("fgDanger"),
      );
    const { draw, box, columns, axis } = bare(subject);
    return (
      draw +
      annotate(
        tone,
        columns,
        "left",
        gap,
        gap.centre.y,
        "gap-1 = 4px to the message",
      ) +
      code(
        tone,
        axis,
        box.y2 + STEP,
        escaped('<CSelect invalid message="…" />'),
        { anchor: "middle" },
      )
    );
  };

  const messageDont = async () => {
    const under = TOP + TRIGGER_H;
    const missing = region(
      tone,
      "fault",
      0,
      round(under + FIELD_GAP),
      TRIGGER_W,
      MESSAGE_LINE,
    );
    const subject =
      ink(0, centre(0, LABEL_LINE, BODY), "Region", BODY, c("fg")) +
      face(0, TOP, TRIGGER_W, TRIGGER_H, c("page"), c("lineStrong")) +
      written(0, TOP, TRIGGER_H, "Choose", c("muted")) +
      (await chevron(
        blockX(0, TRIGGER_W, BLOCK_W) + ICON_PAD_LEFT,
        iconY(TOP, TRIGGER_H),
      )) +
      missing.draw;
    const { draw, box, columns, axis } = bare(subject);
    return (
      draw +
      annotate(
        tone,
        columns,
        "left",
        missing,
        missing.centre.y,
        "no caption, and no border change",
        "prose",
        "key",
      ) +
      keyCode(
        tone,
        axis,
        box.y2 + STEP,
        escaped("<CSelect invalid /> changes no pixel"),
        { anchor: "middle" },
      )
    );
  };

  const [invalidDo, invalidDont] = matched(
    await messageDo(),
    await messageDont(),
  );

  return {
    "component-select-default": await anatomy(),
    "component-select-values": await values(),
    "component-select-open": await open(),
    "component-select-multiple": await branches(),
    "component-select-invalid-do": invalidDo,
    "component-select-invalid-dont": invalidDont,
  };
};
