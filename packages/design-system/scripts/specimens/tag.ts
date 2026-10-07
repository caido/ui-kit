import type { Point, Slot, Tone } from "./kit.ts";
import {
  annotate,
  bare,
  BOLD,
  CAPTION,
  centre,
  code,
  decoded,
  escaped,
  GAP,
  GRID,
  glyph,
  glyphSpan,
  ink,
  keyCode,
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
} from "./kit.ts";

const ROOT = 14;

const PAD_X = round(0.4 * ROOT);
const PAD_Y = GRID;
const LINE_BOX = GRID * 4;
const TAG_H = LINE_BOX + PAD_Y * 2;
const BORDER = 1;
const CATEGORY_H = TAG_H + BORDER * 2;

const SMALL_W = GRID * 12;
const MEDIUM_W = GRID * 16;
const ICON = CAPTION;

const CAP_DROP = GRID * 4;
const WIDE_DROP = GRID * 8;
const ABOVE = GRID * 7;
const BELOW = GRID * 10;
const MARK_DROP = GRID * 4;
const BASE = round(CAPTION * 0.35);

const PX_LABEL = "5.6px a side, set by the preset";
const PY_LABEL = "py-1 stays 4px at any size";
const CORNER_LABEL = "a 6px corner on every tag";
const DEFAULT_NOTE = "a caption line box plus py-1 top and bottom";
const INFO_CAPTION = 'severity="info"';
const PLAIN_CAPTION = "no severity at all";

const SEVERITY_NOTE = "the middle four are surface-X + fg-X-strong";
const CATEGORY_NOTE = "category-X-fill, -line and -fg";

const ICON_CAPTION = "sized by its glyph";
const WIDTH_NOTE = "an empty tag is pinned at 24px by h-6";

const AXIS_DANGER = 'severity="danger"';
const AXIS_CATEGORY = 'category="magenta"';
const AXIS_LINE_LABEL = "only a category draws a 1px line";
const AXIS_NOTE = "one axis per tag, and each paints its own";
const BOTH_CODE = 'category="magenta" severity="danger"';
const BOTH_LABEL = "the severity never reaches the page";
const BOTH_NOTE = "a category present drops the severity";

const STACK_CODE = escaped(
  '<HStack :gap="2"><CTag severity="info" /><CTag severity="success" /></HStack>',
);
const STACK_TOKEN = ':gap="2"';
const STACK_GAP_LABEL = "the 8px comes from gap-2";
const STACK_OWNER_LABEL = "the parent owns the gap";
const STACK_NOTE = "severity picks the fill, the parent the gap";
const CLASS_CODE = escaped(
  '<CTag label="Read only" severity="info" class="ml-2" />',
);
const CLASS_TOKEN = 'class="ml-2"';
const CLASS_LABEL = "class is dropped before it is applied";
const CLASS_NOTE = "nothing class-shaped reaches the root";

const STACK_GAP = GRID * 2;

export const tagSpecimens = async (tone: Tone) => {
  const c = (key: string) => tint(tone, key);

  const tagWidth = (text: string) => round(textWidth(text, CAPTION) + PAD_X * 2);

  const chipAt = (
    x: number,
    y: number,
    text: string,
    fill: string,
    colour: string,
    stroke?: string,
    fixed?: number,
  ) => {
    const natural = tagWidth(text) + (stroke === undefined ? 0 : BORDER * 2);
    const w = fixed ?? natural;
    const h = stroke === undefined ? TAG_H : CATEGORY_H;
    return (
      plate(x, y, w, h, { fill, stroke, radius: RADIUS }) +
      (text === ""
        ? ""
        : ink(x + w / 2, centre(y, h, CAPTION), text, CAPTION, colour, {
            anchor: "middle",
            weight: BOLD,
          }))
    );
  };

  const infoW = tagWidth("Read only");
  const plainW = tagWidth("Temporary");
  const officialW = tagWidth("Official");

  const defaultSpots: Point[] = [];
  const defaultRow = oneLineRow(
    [
      {
        width: slotWidth(infoW, INFO_CAPTION, CAPTION),
        draw: (cx: number, y: number) => {
          const x = round(cx - infoW / 2);
          defaultSpots.push({ x, y });
          return (
            chipAt(x, y, "Read only", c("surfaceInfo"), c("fgInfoStrong")) +
            keyCode(
              tone,
              cx,
              round(y + TAG_H + WIDE_DROP + BASE),
              INFO_CAPTION,
              { anchor: "middle" },
            )
          );
        },
      },
      {
        width: slotWidth(plainW, PLAIN_CAPTION, CAPTION),
        draw: (cx: number, y: number) => {
          const x = round(cx - plainW / 2);
          defaultSpots.push({ x, y });
          return (
            chipAt(x, y, "Temporary", "none", c("fg")) +
            prose(
              tone,
              cx,
              round(y + TAG_H + WIDE_DROP + BASE),
              PLAIN_CAPTION,
              { anchor: "middle" },
            )
          );
        },
      },
    ],
    0,
    0,
  );

  const filled = defaultSpots[0] ?? { x: 0, y: 0 };
  const anatomy = bare(defaultRow);
  const sidePad = region(tone, "padding", filled.x, filled.y, PAD_X, TAG_H);
  const sidePadTop: Point = { x: round(filled.x + PAD_X / 2), y: filled.y };
  const footPad = region(
    tone,
    "padding",
    round(filled.x + PAD_X),
    round(filled.y + TAG_H - PAD_Y),
    round(infoW - PAD_X * 2),
    PAD_Y,
  );
  const unfilled = defaultSpots[1] ?? { x: 0, y: 0 };
  const corner = region(tone, "border", unfilled.x, unfilled.y, plainW, TAG_H);

  const severities: [string, string, string][] = [
    ["secondary", c("hover"), c("fg")],
    ["success", c("surfaceSuccess"), c("fgSuccessStrong")],
    ["info", c("surfaceInfo"), c("fgInfoStrong")],
    ["warn", c("surfaceWarn"), c("fgWarnStrong")],
    ["danger", c("surfaceDanger"), c("fgDangerStrong")],
    ["contrast", c("fillNeutral"), c("onNeutral")],
  ];

  const severityRow = oneLineRow(
    severities.map(([name, fill, colour]): Slot => {
      const w = tagWidth(name);
      return {
        width: w,
        draw: (cx: number, y: number) =>
          chipAt(round(cx - w / 2), y, name, fill, colour),
      };
    }),
    0,
    0,
  );
  const severityGroup = bare(severityRow);

  const names = [
    "amber",
    "azure",
    "fern",
    "lime",
    "magenta",
    "rust",
    "teal",
    "violet",
  ];

  const categoryRow = oneLineRow(
    names.map((name): Slot => {
      const w = tagWidth(name) + BORDER * 2;
      return {
        width: w,
        draw: (cx: number, y: number) =>
          chipAt(
            round(cx - w / 2),
            y,
            name,
            c(`category-${name}-fill`),
            c(`category-${name}-fg`),
            c(`category-${name}-line`),
          ),
      };
    }),
    0,
    0,
  );
  const categoryGroup = bare(categoryRow);

  const iconSpan = await glyphSpan("layer-group", ICON);
  const iconW = round(iconSpan + PAD_X * 2 + BORDER * 2);

  const widthCases: [string, number, string, string, string][] = [
    ["404", SMALL_W, c("surfaceDanger"), c("fgDangerStrong"), "w-12 is 48px"],
    ["", MEDIUM_W, c("surfaceInfo"), c("fgInfoStrong"), "w-16 is 64px"],
    ["", SMALL_W, c("surfaceSuccess"), c("fgSuccessStrong"), "w-12, no label"],
  ];

  const widthSpots: Point[] = [];
  const widthRow = oneLineRow(
    [
      ...widthCases.map(
        ([text, w, fill, colour, caption]): Slot => ({
          width: slotWidth(w, caption, CAPTION),
          draw: (cx: number, y: number) => {
            const x = round(cx - w / 2);
            widthSpots.push({ x, y });
            return (
              chipAt(x, y, text, fill, colour, undefined, w) +
              code(tone, cx, round(y + CATEGORY_H + CAP_DROP + BASE), caption, {
                anchor: "middle",
              })
            );
          },
        }),
      ),
      {
        width: slotWidth(iconW, ICON_CAPTION, CAPTION),
        draw: (cx: number, y: number) => {
          const x = round(cx - iconW / 2);
          widthSpots.push({ x, y });
          return (
            chipAt(
              x,
              y,
              "",
              c("category-lime-fill"),
              c("category-lime-fg"),
              c("category-lime-line"),
              iconW,
            ) +
            prose(
              tone,
              cx,
              round(y + CATEGORY_H + CAP_DROP + BASE),
              ICON_CAPTION,
              { anchor: "middle" },
            )
          );
        },
      },
    ],
    0,
    0,
  );

  const widthGlyph = await glyph(
    "layer-group",
    round((widthSpots[3]?.x ?? 0) + PAD_X + BORDER),
    round((CATEGORY_H - ICON) / 2),
    ICON,
    c("category-lime-fg"),
  );

  const widthGroup = bare(widthRow + widthGlyph);

  const axisDangerW = tagWidth("DELETE");
  const axisCategoryW = tagWidth("Alpha") + BORDER * 2;

  const axisSpots: Point[] = [];
  const axisRow = oneLineRow(
    [
      {
        width: slotWidth(axisDangerW, AXIS_DANGER, CAPTION),
        draw: (cx: number, y: number) => {
          const x = round(cx - axisDangerW / 2);
          axisSpots.push({ x, y });
          return (
            chipAt(
              x,
              y,
              "DELETE",
              c("surfaceDanger"),
              c("fgDangerStrong"),
            ) +
            code(
              tone,
              cx,
              round(y + CATEGORY_H + CAP_DROP + BASE),
              AXIS_DANGER,
              { anchor: "middle" },
            )
          );
        },
      },
      {
        width: slotWidth(axisCategoryW, AXIS_CATEGORY, CAPTION),
        draw: (cx: number, y: number) => {
          const x = round(cx - axisCategoryW / 2);
          axisSpots.push({ x, y });
          return (
            chipAt(
              x,
              y,
              "Alpha",
              c("category-magenta-fill"),
              c("category-magenta-fg"),
              c("category-magenta-line"),
            ) +
            code(
              tone,
              cx,
              round(y + CATEGORY_H + CAP_DROP + BASE),
              AXIS_CATEGORY,
              { anchor: "middle" },
            )
          );
        },
      },
    ],
    0,
    0,
  );

  const axisGroup = bare(axisRow);
  const accented = axisSpots[1] ?? { x: 0, y: 0 };
  const axisLine = region(
    tone,
    "border",
    accented.x,
    accented.y,
    axisCategoryW,
    CATEGORY_H,
  );

  const bothW = tagWidth("DELETE") + BORDER * 2;
  const bothCodeX = round(-textWidth(decoded(BOTH_CODE), CAPTION) / 2);
  const bothCodeY = round(CATEGORY_H + CAP_DROP + BASE);
  const bothDrawing =
    chipAt(
      round(-bothW / 2),
      0,
      "DELETE",
      c("category-magenta-fill"),
      c("category-magenta-fg"),
      c("category-magenta-line"),
    ) + code(tone, bothCodeX, bothCodeY, BOTH_CODE);
  const bothGroup = bare(bothDrawing);
  const bothFault = markToken(
    tone,
    "fault",
    bothCodeX,
    bothCodeY,
    BOTH_CODE,
    AXIS_DANGER,
  );

  const stackPairW = round(infoW + STACK_GAP + officialW);
  const stackLeft = round(-stackPairW / 2);
  const stackCodeX = round(-textWidth(decoded(STACK_CODE), CAPTION) / 2);
  const stackCodeY = round(TAG_H + CAP_DROP + BASE);
  const stackChips =
    chipAt(stackLeft, 0, "Read only", c("surfaceInfo"), c("fgInfoStrong")) +
    chipAt(
      round(stackLeft + infoW + STACK_GAP),
      0,
      "Official",
      c("surfaceSuccess"),
      c("fgSuccessStrong"),
    );
  const stackCode = code(tone, stackCodeX, stackCodeY, STACK_CODE);
  const stackGroup = bare(stackChips);
  const stackGap = region(
    tone,
    "gap",
    round(stackLeft + infoW),
    0,
    STACK_GAP,
    TAG_H,
  );
  const stackGapTop: Point = { x: stackGap.centre.x, y: 0 };
  const stackToken = markToken(
    tone,
    "gap",
    stackCodeX,
    stackCodeY,
    STACK_CODE,
    STACK_TOKEN,
  );

  const classCodeX = round(-textWidth(decoded(CLASS_CODE), CAPTION) / 2);
  const classDrawing =
    chipAt(
      round(-infoW / 2),
      0,
      "Read only",
      c("surfaceInfo"),
      c("fgInfoStrong"),
    ) + code(tone, classCodeX, stackCodeY, CLASS_CODE);
  const classGroup = bare(classDrawing);
  const classFault = markToken(
    tone,
    "fault",
    classCodeX,
    stackCodeY,
    CLASS_CODE,
    CLASS_TOKEN,
  );

  return {
    "component-tag-default":
      anatomy.draw +
      sidePad.draw +
      footPad.draw +
      corner.draw +
      annotate(tone, anatomy.columns, "left", sidePadTop, -ABOVE, PX_LABEL) +
      annotate(tone, anatomy.columns, "left", footPad, BELOW, PY_LABEL) +
      annotate(tone, anatomy.columns, "right", corner, -ABOVE, CORNER_LABEL) +
      note(
        tone,
        anatomy.axis,
        round(TAG_H + WIDE_DROP + BASE + GAP),
        DEFAULT_NOTE,
      ),

    "component-tag-severities":
      severityGroup.draw +
      code(
        tone,
        severityGroup.axis,
        round(TAG_H + CAP_DROP + BASE),
        SEVERITY_NOTE,
        { anchor: "middle" },
      ),

    "component-tag-categories":
      categoryGroup.draw +
      code(
        tone,
        categoryGroup.axis,
        round(CATEGORY_H + CAP_DROP + BASE),
        CATEGORY_NOTE,
        { anchor: "middle" },
      ),

    "component-tag-widths":
      widthGroup.draw +
      note(
        tone,
        widthGroup.axis,
        round(CATEGORY_H + CAP_DROP + BASE + GAP),
        WIDTH_NOTE,
      ),

    "component-tag-axis-do":
      axisGroup.draw +
      axisLine.draw +
      annotate(
        tone,
        axisGroup.columns,
        "right",
        axisLine,
        -ABOVE,
        AXIS_LINE_LABEL,
      ) +
      note(
        tone,
        axisGroup.axis,
        round(CATEGORY_H + CAP_DROP + BASE + GAP),
        AXIS_NOTE,
      ),

    "component-tag-axis-dont":
      bothGroup.draw +
      bothFault.draw +
      annotate(
        tone,
        bothGroup.columns,
        "right",
        bothFault,
        round(bothCodeY + BASE + MARK_DROP),
        BOTH_LABEL,
        "prose",
      ) +
      note(
        tone,
        bothGroup.axis,
        round(bothCodeY + BASE + MARK_DROP + GAP),
        BOTH_NOTE,
      ),

    "component-tag-class-do":
      stackGroup.draw +
      stackCode +
      stackGap.draw +
      stackToken.draw +
      annotate(
        tone,
        stackGroup.columns,
        "left",
        stackGapTop,
        -ABOVE,
        STACK_GAP_LABEL,
      ) +
      annotate(
        tone,
        stackGroup.columns,
        "right",
        stackToken,
        round(stackCodeY + BASE + MARK_DROP),
        STACK_OWNER_LABEL,
        "prose",
      ) +
      note(
        tone,
        stackGroup.axis,
        round(stackCodeY + BASE + MARK_DROP + GAP),
        STACK_NOTE,
      ),

    "component-tag-class-dont":
      classGroup.draw +
      classFault.draw +
      annotate(
        tone,
        classGroup.columns,
        "right",
        classFault,
        round(stackCodeY + BASE + MARK_DROP),
        CLASS_LABEL,
        "prose",
      ) +
      note(
        tone,
        classGroup.axis,
        round(stackCodeY + BASE + MARK_DROP + GAP),
        CLASS_NOTE,
      ),
  };
};
