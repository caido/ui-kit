import type { Slot, Tone } from "./kit.ts";
import {
  BODY,
  CAPTION,
  DISABLED,
  GAP,
  GRID,
  MEDIUM,
  RADIUS,
  ROW_CORNER,
  annotate,
  bare,
  centre,
  code,
  dim,
  escaped,
  ink,
  markToken,
  note,
  oneLineRow,
  plate,
  prose,
  region,
  slotWidth,
  staged,
  tint,
} from "./kit.ts";

type Option = {
  width: number;
  text: string;
  selected?: boolean;
  lit?: boolean;
};

const BORDER = 1;

const PAD_X = GRID * 4;

const PAD_Y = GRID * 1.5;

const INSET = GRID;

const HALF_REM = BODY / 2;

const RING = 2;

const BUTTON_H = 29;

const GROUP_H = BUTTON_H + BORDER * 2;

const MARKDOWN_W = 101;

const RAW_W = 62;

const PAIR_W = MARKDOWN_W + RAW_W;

const GROUP_W = PAIR_W + BORDER * 2;

const TILE_W = RAW_W + BORDER * 2;

const FLUID_W = 400;

const FLUID_OPTION = (FLUID_W - BORDER * 2) / 2;

const NARROW_W = 120;

const OVERFLOW_W = GROUP_W - NARROW_W;

const SPARE_W = GRID * 12;

const PARENT_PAD = GRID;

const PARENT_W = GROUP_W + SPARE_W;

const PARENT_H = GROUP_H + PARENT_PAD * 2;

const LINE_STEP = GRID * 4;

const CAPTION_DROP = GRID * 5;

const INDENT = "  ";

export const segmentedSpecimens = (tone: Tone) => {
  const c = (key: string) => tint(tone, key);

  const shell = (x: number, y: number, w: number, fade?: number) =>
    plate(x, y, w, GROUP_H, {
      fill: c("page"),
      radius: RADIUS,
      opacity: fade,
    });

  const selection = (x: number, y: number, w: number, fade?: number) =>
    plate(x + INSET, y + INSET, w - HALF_REM, BUTTON_H - HALF_REM, {
      fill: c("raised"),
      radius: ROW_CORNER,
      opacity: fade,
    });

  const optionText = (
    x: number,
    y: number,
    w: number,
    text: string,
    colour: string,
    fade?: number,
  ) =>
    ink(x + w / 2, centre(y, BUTTON_H, BODY), text, BODY, colour, {
      anchor: "middle",
      weight: MEDIUM,
      opacity: fade,
    });

  const options = (
    x: number,
    y: number,
    set: readonly Option[],
    fade?: number,
  ) => {
    let cursor = x + BORDER;
    return set
      .map((option) => {
        const at = cursor;
        cursor += option.width;
        const chosen = option.selected === true;
        return (
          (chosen ? selection(at, y + BORDER, option.width, fade) : "") +
          optionText(
            at,
            y + BORDER,
            option.width,
            option.text,
            chosen || option.lit === true ? c("strong") : c("subtleFg"),
            fade,
          )
        );
      })
      .join("");
  };

  const group = (
    x: number,
    y: number,
    set: readonly Option[],
    fade?: number,
  ) =>
    shell(
      x,
      y,
      set.reduce((sum, option) => sum + option.width, 0) + BORDER * 2,
      fade,
    ) + options(x, y, set, fade);

  const parentBox = (x: number, y: number, w: number) =>
    plate(x, y, w, PARENT_H, {
      stroke: c("line"),
      weight: BORDER,
      dash: "4 3",
      radius: RADIUS,
    });

  const shipped: Option[] = [
    { width: MARKDOWN_W, text: "Markdown", selected: true },
    { width: RAW_W, text: "Raw" },
  ];

  const anatomy = staged(tone, group(0, 0, shipped));

  const padX = region(tone, "padding", BORDER, BORDER, PAD_X, BUTTON_H);

  const padY = region(
    tone,
    "padding",
    BORDER,
    BORDER + BUTTON_H - PAD_Y,
    MARKDOWN_W,
    PAD_Y,
  );

  const edge = region(tone, "border", 0, 0, GROUP_W, GROUP_H);

  const tiles: {
    name: string;
    option: Option;
    ring?: boolean;
    fade?: boolean;
  }[] = [
    { name: "default", option: { width: RAW_W, text: "Raw" } },
    { name: "hover", option: { width: RAW_W, text: "Raw", lit: true } },
    { name: "selected", option: { width: RAW_W, text: "Raw", selected: true } },
    { name: "focus", option: { width: RAW_W, text: "Raw" }, ring: true },
    { name: "disabled", option: { width: RAW_W, text: "Raw" }, fade: true },
  ];

  const states: Slot[] = tiles.map(({ name, option, ring, fade }) => ({
    width: slotWidth(
      ring === true ? TILE_W + RING * 4 : TILE_W,
      name,
      CAPTION,
    ),
    draw: (middle: number, y: number) => {
      const x = middle - TILE_W / 2;
      const outline =
        ring === true
          ? plate(x - RING * 2, y - RING * 2, TILE_W + RING * 4, GROUP_H + RING * 4, {
              stroke: c("focus"),
              weight: RING,
              radius: RADIUS + RING * 2,
            })
          : "";
      return (
        group(x, y, [option], fade === true ? DISABLED : undefined) +
        outline +
        prose(tone, middle, y + GROUP_H + GRID * 5, name, { anchor: "middle" })
      );
    },
  }));

  const row = staged(tone, oneLineRow(states, 0, 0));

  const narrowY = PARENT_H + GRID * 6;

  const scenes = staged(
    tone,
    dim(0, -GRID * 3, FLUID_W, `${FLUID_W}px parent`, c("muted")) +
      parentBox(0, 0, FLUID_W) +
      group(0, PARENT_PAD, [
        { width: FLUID_OPTION, text: "Markdown", selected: true },
        { width: FLUID_OPTION, text: "Raw" },
      ]) +
      parentBox(0, narrowY, NARROW_W) +
      group(0, narrowY + PARENT_PAD, shipped),
  );

  const overflow = region(
    tone,
    "fault",
    NARROW_W,
    narrowY + PARENT_PAD,
    OVERFLOW_W,
    GROUP_H,
  );

  const overflowColumns = {
    left: scenes.columns.left,
    right: NARROW_W + OVERFLOW_W + GAP,
  };

  const snug = staged(
    tone,
    parentBox(0, 0, PARENT_W) + group(0, PARENT_PAD, shipped),
  );

  const spare = region(tone, "gap", GROUP_W, PARENT_PAD, SPARE_W, GROUP_H);

  const spread = staged(
    tone,
    parentBox(0, 0, PARENT_W) +
      shell(0, PARENT_PAD, PARENT_W) +
      options(0, PARENT_PAD, shipped),
  );

  const dead = region(
    tone,
    "fault",
    BORDER + PAIR_W,
    PARENT_PAD + BORDER,
    SPARE_W,
    BUTTON_H,
  );

  const lines = (set: readonly string[]) =>
    set
      .map((text, index) => code(tone, 0, index * LINE_STEP, escaped(text)))
      .join("");

  const sized = [
    '<div class="w-40">',
    `${INDENT}<CSegmented fluid />`,
    "</div>",
  ];

  const classed = [
    "<CSegmented",
    `${INDENT}class="w-40"`,
    `${INDENT}v-model="mode" />`,
  ];

  const sizedBlock = bare(lines(sized));

  const classedBlock = bare(lines(classed));

  const dropped = markToken(
    tone,
    "fault",
    0,
    LINE_STEP,
    classed[1] ?? "",
    'class="w-40"',
  );

  return {
    "component-segmented-default":
      anatomy.draw +
      padX.draw +
      padY.draw +
      edge.draw +
      annotate(
        tone,
        anatomy.columns,
        "left",
        padX,
        BORDER + BUTTON_H / 2,
        "px-4 = 16px padding",
      ) +
      annotate(
        tone,
        anatomy.columns,
        "left",
        padY,
        GROUP_H + GRID * 3,
        "py-1.5 = 6px padding",
      ) +
      annotate(
        tone,
        anatomy.columns,
        "right",
        edge,
        -GRID * 2,
        `rounded-md = ${RADIUS}px, border is transparent`,
      ) +
      note(
        tone,
        anatomy.axis,
        anatomy.box.y2 + CAPTION_DROP,
        "Every button is surface-page; only the selected pill is raised.",
      ),

    "component-segmented-states":
      row.draw +
      note(
        tone,
        row.axis,
        row.box.y2 + CAPTION_DROP,
        "Hover moves the label only; the background never changes.",
      ),

    "component-segmented-fluid":
      scenes.draw +
      overflow.draw +
      annotate(
        tone,
        overflowColumns,
        "right",
        overflow,
        narrowY + PARENT_PAD + GROUP_H / 2,
        `${OVERFLOW_W}px past the ${NARROW_W}px parent`,
        "code",
        "key",
      ),

    "component-segmented-parent-do":
      snug.draw +
      spare.draw +
      annotate(
        tone,
        snug.columns,
        "right",
        spare,
        PARENT_PAD + GROUP_H / 2,
        `${SPARE_W}px of the row stays free`,
      ) +
      prose(
        tone,
        snug.box.x1,
        snug.box.y2 + CAPTION_DROP,
        "A flex row leaves the group at its content width.",
      ),

    "component-segmented-parent-dont":
      spread.draw +
      dead.draw +
      annotate(
        tone,
        spread.columns,
        "right",
        dead,
        PARENT_PAD + GROUP_H / 2,
        `${SPARE_W}px of box with no button`,
        "code",
        "key",
      ) +
      prose(
        tone,
        spread.box.x1,
        spread.box.y2 + CAPTION_DROP,
        "A block parent spreads the box; the buttons do not follow.",
      ),

    "component-segmented-width-do":
      sizedBlock.draw +
      prose(
        tone,
        sizedBlock.box.x1,
        sizedBlock.box.y2 + CAPTION_DROP,
        "Size the parent, then let fluid fill it.",
      ),

    "component-segmented-width-dont":
      classedBlock.draw +
      dropped.draw +
      annotate(
        tone,
        classedBlock.columns,
        "right",
        dropped,
        LINE_STEP,
        "class is dropped",
        "code",
        "key",
      ) +
      prose(
        tone,
        classedBlock.box.x1,
        classedBlock.box.y2 + CAPTION_DROP,
        "The allow-list drops class before the DOM.",
      ),
  };
};
