import type { Slot, Tone } from "./kit.ts";
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
  note,
  oneLineRow,
  OUTLINE,
  plate,
  RADIUS,
  region,
  resting,
  roleColour,
  round,
  rule,
  slotWidth,
  textWidth,
  tint,
  TITLE,
  VEIL,
} from "./kit.ts";

const BORDER = 1;

const PAD_X = GRID * 3;

const PAD_X_LARGE = GRID * 4;

const PAD_Y = GRID * 2;

const PAD_Y_SMALL = GRID * 1.5;

const ICON_GAP = GRID * 2;

const SMALL_HEIGHT = 28.5;

const MEDIUM_HEIGHT = 35;

const LARGE_HEIGHT = 48;

const TEXT_HEIGHT = MEDIUM_HEIGHT - BORDER * 2;

const ICON_HEIGHT = 32;

const SHORTFALL = MEDIUM_HEIGHT - ICON_HEIGHT;

const CONTENT_HEIGHT = MEDIUM_HEIGHT - BORDER * 2 - PAD_Y * 2;

const TOP = GRID * 10;

const LIFT = GRID * 3;

const STEP = GRID * 5;

const NOTE_STEP = GRID * 7;

const AXIS = 400;

const boxWidth = (text: string, size: number, padX: number) =>
  round(padX * 2 + BORDER * 2 + textWidth(text, size));

export const buttonSpecimens = async (tone: Tone) => {
  const c = (key: string) => tint(tone, key);
  const rest = resting(tone);
  const spinnerSpan = await glyphSpan("spinner", BODY);
  const trashSpan = await glyphSpan("trash", BODY);

  const solid = (
    x: number,
    y: number,
    w: number,
    h: number,
    text: string,
    size: number,
    fill: string = rest.fill,
    colour: string = rest.text,
  ) =>
    plate(x, y, w, h, { fill, stroke: fill, radius: RADIUS }) +
    ink(x + w / 2, centre(y, h, size), text, size, colour, {
      anchor: "middle",
    });

  const guides = (left: number, right: number, top: number, bottom: number) =>
    rule(left, top, right, top, c("edge"), { dash: "3 2" }) +
    rule(left, bottom, right, bottom, c("edge"), { dash: "3 2" });

  const caption = (axis: number, y: number, text: string) =>
    code(tone, axis, y, text, { anchor: "middle" });

  const saveWidth = boxWidth("Save", BODY, PAD_X);

  const anatomyX = 300;
  const anatomyPadX = region(
    tone,
    "padding",
    anatomyX + BORDER,
    TOP + BORDER + PAD_Y,
    PAD_X,
    CONTENT_HEIGHT,
  );
  const anatomyPadY = region(
    tone,
    "padding",
    anatomyX + BORDER,
    TOP + MEDIUM_HEIGHT - BORDER - PAD_Y,
    saveWidth - BORDER * 2,
    PAD_Y,
  );
  const anatomyRing = region(
    tone,
    "border",
    anatomyX,
    TOP,
    saveWidth,
    MEDIUM_HEIGHT,
  );
  const anatomy = bare(
    solid(anatomyX, TOP, saveWidth, MEDIUM_HEIGHT, "Save", BODY) +
      anatomyPadX.draw +
      anatomyPadY.draw +
      anatomyRing.draw,
  );

  let solidX = 0;
  let outlinedX = 0;
  const variantName = (axis: number, text: string) =>
    caption(axis, TOP + MEDIUM_HEIGHT + STEP, text);
  const variantSlots: Slot[] = [
    {
      width: slotWidth(saveWidth, "solid", CAPTION),
      draw: (axis, y) => {
        solidX = round(axis - saveWidth / 2);
        return (
          solid(solidX, y, saveWidth, MEDIUM_HEIGHT, "Save", BODY) +
          variantName(axis, "solid")
        );
      },
    },
    {
      width: slotWidth(saveWidth, "outlined", CAPTION),
      draw: (axis, y) => {
        outlinedX = round(axis - saveWidth / 2);
        return (
          plate(outlinedX, y, saveWidth, MEDIUM_HEIGHT, {
            stroke: rest.fill,
            radius: RADIUS,
          }) +
          ink(
            axis,
            centre(y, MEDIUM_HEIGHT, BODY),
            "Save",
            BODY,
            c("fgPrimary"),
            {
              anchor: "middle",
            },
          ) +
          variantName(axis, "outlined")
        );
      },
    },
    {
      width: slotWidth(saveWidth - BORDER * 2, "text", CAPTION),
      draw: (axis, y) =>
        ink(
          axis,
          centre(y + BORDER, TEXT_HEIGHT, BODY),
          "Save",
          BODY,
          c("fgPrimary"),
          { anchor: "middle" },
        ) + variantName(axis, "text"),
    },
  ];
  const variantRow = oneLineRow(variantSlots, AXIS, TOP);
  const variantPad = region(
    tone,
    "padding",
    solidX + BORDER,
    TOP + BORDER + PAD_Y,
    PAD_X,
    CONTENT_HEIGHT,
  );
  const variantRing = region(
    tone,
    "border",
    outlinedX,
    TOP,
    saveWidth,
    MEDIUM_HEIGHT,
  );
  const variants = bare(variantRow + variantPad.draw + variantRing.draw);

  const severities: [string, string, string][] = [
    ["primary", c("primary"), c("onPrimary")],
    ["contrast", c("neutralSubtle"), c("onNeutralSubtle")],
    ["secondary", c("accent"), c("onSecondary")],
    ["success", c("success"), c("onSuccess")],
    ["info", c("infoStrong"), c("onInfo")],
    ["warn", c("warn"), c("onWarn")],
    ["danger", c("danger"), c("onDanger")],
  ];
  const severitySlots: Slot[] = severities.map(([name, fill, colour]) => ({
    width: boxWidth(name, BODY, PAD_X),
    draw: (axis, y) =>
      solid(
        round(axis - boxWidth(name, BODY, PAD_X) / 2),
        y,
        boxWidth(name, BODY, PAD_X),
        MEDIUM_HEIGHT,
        name,
        BODY,
        fill,
        colour,
      ),
  }));
  const severityRow = bare(oneLineRow(severitySlots, AXIS, TOP));

  const smallWidth = boxWidth("Save", CAPTION, PAD_X);
  const largeWidth = boxWidth("Save", TITLE, PAD_X_LARGE);
  const base = TOP + LARGE_HEIGHT;
  let smallX = 0;
  let largeX = 0;
  const sizeName = (axis: number, text: string) =>
    caption(axis, base + STEP, text);
  const sizeSlots: Slot[] = [
    {
      width: slotWidth(smallWidth, "small 12px", CAPTION),
      draw: (axis, y) => {
        smallX = round(axis - smallWidth / 2);
        return (
          solid(
            smallX,
            y - SMALL_HEIGHT,
            smallWidth,
            SMALL_HEIGHT,
            "Save",
            CAPTION,
          ) + sizeName(axis, "small 12px")
        );
      },
    },
    {
      width: slotWidth(saveWidth, "medium 14px", CAPTION),
      draw: (axis, y) =>
        solid(
          round(axis - saveWidth / 2),
          y - MEDIUM_HEIGHT,
          saveWidth,
          MEDIUM_HEIGHT,
          "Save",
          BODY,
        ) + sizeName(axis, "medium 14px"),
    },
    {
      width: slotWidth(largeWidth, "large 18px", CAPTION),
      draw: (axis, y) => {
        largeX = round(axis - largeWidth / 2);
        return (
          solid(
            largeX,
            y - LARGE_HEIGHT,
            largeWidth,
            LARGE_HEIGHT,
            "Save",
            TITLE,
          ) + sizeName(axis, "large 18px")
        );
      },
    },
  ];
  const sizeRow = oneLineRow(sizeSlots, AXIS, base);
  const sizePad = region(
    tone,
    "padding",
    smallX + BORDER,
    base - BORDER - PAD_Y_SMALL,
    smallWidth - BORDER * 2,
    PAD_Y_SMALL,
  );
  const sizeRing = region(
    tone,
    "border",
    largeX,
    base - LARGE_HEIGHT,
    largeWidth,
    LARGE_HEIGHT,
  );
  const sizes = bare(sizeRow + sizePad.draw + sizeRing.draw);

  const loadingX = 320;
  const loadingTop = TOP + MEDIUM_HEIGHT + GAP;
  const loadingWidth = round(saveWidth + spinnerSpan + ICON_GAP);
  const spinnerX = round(loadingX + BORDER + PAD_X);
  const loadingLabelX = round(spinnerX + spinnerSpan + ICON_GAP);
  const growth = region(
    tone,
    "gap",
    loadingX + saveWidth,
    TOP + MEDIUM_HEIGHT,
    round(spinnerSpan + ICON_GAP),
    GAP,
  );
  const iconGap = region(
    tone,
    "gap",
    round(spinnerX + spinnerSpan),
    loadingTop + BORDER + PAD_Y,
    ICON_GAP,
    CONTENT_HEIGHT,
  );
  const iconGapFoot = {
    x: iconGap.centre.x,
    y: round(loadingTop + BORDER + PAD_Y + CONTENT_HEIGHT),
  };
  const loading = bare(
    solid(loadingX, TOP, saveWidth, MEDIUM_HEIGHT, "Save", BODY) +
      plate(loadingX, loadingTop, loadingWidth, MEDIUM_HEIGHT, {
        fill: rest.fill,
        stroke: rest.fill,
        radius: RADIUS,
      }) +
      (await glyph(
        "spinner",
        spinnerX,
        round(loadingTop + (MEDIUM_HEIGHT - BODY) / 2),
        BODY,
        rest.text,
      )) +
      ink(
        loadingLabelX,
        centre(loadingTop, MEDIUM_HEIGHT, BODY),
        "Save",
        BODY,
        rest.text,
      ) +
      plate(loadingX, loadingTop, loadingWidth, MEDIUM_HEIGHT, {
        fill: c("page"),
        opacity: VEIL,
        radius: RADIUS,
      }) +
      growth.draw +
      iconGap.draw,
  );

  let doLeft = 0;
  let doRight = 0;
  const doSlots: Slot[] = ["Clear", "Copy", "Close"].map((text, index) => ({
    width: boxWidth(text, BODY, PAD_X),
    draw: (axis, y) => {
      const width = boxWidth(text, BODY, PAD_X);
      if (index === 0) doLeft = round(axis - width / 2 - PAD_Y);
      if (index === 2) doRight = round(axis + width / 2 + PAD_Y);
      return solid(
        round(axis - width / 2),
        y,
        width,
        MEDIUM_HEIGHT,
        text,
        BODY,
      );
    },
  }));
  const doRow = oneLineRow(doSlots, AXIS, TOP);
  const alignmentDo = bare(
    doRow + guides(doLeft, doRight, TOP, TOP + MEDIUM_HEIGHT),
  );

  const iconWidth = round(PAD_X * 2 + BORDER * 2 + trashSpan);
  let iconX = 0;
  let dontLeft = 0;
  let dontRight = 0;
  const dontSlots: Slot[] = [
    {
      width: boxWidth("Export", BODY, PAD_X),
      draw: (axis, y) => {
        const width = boxWidth("Export", BODY, PAD_X);
        dontLeft = round(axis - width / 2 - PAD_Y);
        return solid(
          round(axis - width / 2),
          y,
          width,
          MEDIUM_HEIGHT,
          "Export",
          BODY,
        );
      },
    },
    {
      width: iconWidth,
      draw: (axis, y) => {
        iconX = round(axis - iconWidth / 2);
        dontRight = round(axis + iconWidth / 2 + PAD_Y);
        return plate(iconX, y, iconWidth, ICON_HEIGHT, {
          fill: rest.fill,
          stroke: rest.fill,
          radius: RADIUS,
        });
      },
    },
  ];
  const dontRow = oneLineRow(dontSlots, AXIS, TOP);
  const shortfall = region(
    tone,
    "fault",
    iconX,
    TOP + ICON_HEIGHT,
    iconWidth,
    SHORTFALL,
  );
  const shortfallBar = plate(iconX, TOP + ICON_HEIGHT, iconWidth, SHORTFALL, {
    fill: roleColour(tone, "fault"),
    opacity: OUTLINE,
  });
  const alignmentDont = bare(
    dontRow +
      (await glyph(
        "trash",
        round(iconX + (iconWidth - trashSpan) / 2),
        round(TOP + (ICON_HEIGHT - BODY) / 2),
        BODY,
        rest.text,
      )) +
      guides(dontLeft, dontRight, TOP, TOP + MEDIUM_HEIGHT) +
      shortfallBar,
  );

  return {
    "component-button-default":
      anatomy.draw +
      annotate(
        tone,
        anatomy.columns,
        "left",
        anatomyPadX,
        anatomyPadX.left.y,
        "px-3 puts 12px each side",
      ) +
      annotate(
        tone,
        anatomy.columns,
        "left",
        anatomyPadY,
        TOP + MEDIUM_HEIGHT + STEP,
        "py-2 puts 8px above and below",
      ) +
      annotate(
        tone,
        anatomy.columns,
        "right",
        anatomyRing,
        anatomyRing.right.y,
        "a 1px border in the fill colour",
      ) +
      note(
        tone,
        anatomy.axis,
        TOP + MEDIUM_HEIGHT + STEP + NOTE_STEP,
        "drawn in primary; contrast is the default severity",
      ),

    "component-button-variants":
      variants.draw +
      annotate(
        tone,
        variants.columns,
        "left",
        variantPad,
        variantPad.left.y,
        "px-3 pads all three variants",
      ) +
      annotate(
        tone,
        variants.columns,
        "right",
        variantRing,
        TOP - LIFT,
        "outlined is a 1px border, no fill",
      ) +
      note(
        tone,
        variants.axis,
        TOP + MEDIUM_HEIGHT + STEP + NOTE_STEP,
        "text drops the border, so it is 2px shorter",
      ),

    "component-button-severities":
      severityRow.draw +
      note(
        tone,
        severityRow.axis,
        TOP + MEDIUM_HEIGHT + NOTE_STEP,
        "only primary, secondary and contrast fill from a plain token",
      ),

    "component-button-sizes":
      sizes.draw +
      annotate(
        tone,
        sizes.columns,
        "left",
        sizePad,
        sizePad.left.y,
        "py-1.5 pads small 6px",
      ) +
      annotate(
        tone,
        sizes.columns,
        "right",
        sizeRing,
        sizeRing.right.y,
        "a 1px border at every size",
      ) +
      note(
        tone,
        sizes.axis,
        base + STEP + NOTE_STEP,
        "the padding and the type step together",
      ),

    "component-button-loading":
      loading.draw +
      annotate(
        tone,
        loading.columns,
        "left",
        iconGapFoot,
        loadingTop + MEDIUM_HEIGHT + STEP,
        "gap-2 puts 8px from spinner to label",
      ) +
      annotate(
        tone,
        loading.columns,
        "right",
        growth,
        growth.right.y,
        "the spinner and its gap widen the button",
      ) +
      note(
        tone,
        loading.axis,
        loadingTop + MEDIUM_HEIGHT + STEP + NOTE_STEP,
        "loading adds a spinner and disables the button",
      ),

    "component-button-alignment-do":
      alignmentDo.draw +
      note(
        tone,
        alignmentDo.axis,
        TOP + MEDIUM_HEIGHT + STEP + NOTE_STEP,
        "one size and one variant: every edge lines up",
      ),

    "component-button-alignment-dont":
      alignmentDont.draw +
      annotate(
        tone,
        alignmentDont.columns,
        "left",
        shortfall,
        TOP + MEDIUM_HEIGHT + STEP,
        "the icon box is 3px shorter",
        "prose",
        "key",
      ) +
      note(
        tone,
        alignmentDont.axis,
        TOP + MEDIUM_HEIGHT + STEP + NOTE_STEP,
        "an icon-only button is shorter than a labelled one",
      ),
  };
};
