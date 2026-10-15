import type { Tone } from "./kit.ts";
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
  plate,
  RADIUS,
  region,
  round,
  ROW_CORNER,
  textWidth,
  tint,
} from "./kit.ts";

const BORDER = 1;
const PANEL_PAD = GRID;
const ITEM_MARGIN = GRID / 2;
const ITEM_GAP = ITEM_MARGIN * 2;
const CONTEXT_PAD_X = GRID * 4;
const CONTEXT_PAD_Y = GRID * 1.5;
const MENU_PAD_X = GRID * 3;
const MENU_PAD_Y = GRID * 2;
const FLEX_GAP = GRID * 2;
const TRAILING_PAD = GRID;
const ICON = BODY;
const BODY_LINE = GRID * 5;
const CONTEXT_ROW = CONTEXT_PAD_Y * 2 + BODY_LINE;
const MENU_ROW = 33;
const SECTION_ROW = BODY_LINE;
const SEPARATOR = 1;
const MIN_PANEL = round(12.5 * BODY);
const POPOVER = GRID * 60;
const ASKED = GRID * 64;
const PLATE_PAD = GRID * 2;
const EDGE_TICK = GRID * 6;
const SEPARATOR_MARK = GRID * 8;
const HALF_ROW = round(CONTEXT_ROW / 2);
const LABEL_DROP = GRID * 4;

const CONTEXT_PAD_X_LABEL = "px-4 insets the row by 16px";
const CONTEXT_PAD_Y_LABEL = "py-1.5 pads 6px above the label";
const PANEL_EDGE_LABEL = "the panel border: 1px line-default";
const SEPARATOR_LABEL = "the separator is a 1px border-t";
const ROW_GAP_LABEL = "margins add to a 4px row gap";
const FLYOUT_EDGE_LABEL = "the flyout has its own border";
const SUBMENU_NOTE = "the parent row stays selected while the flyout is open";
const MENU_PAD_X_LABEL = "px-3 insets a CMenu row by 12px";
const MENU_PAD_Y_LABEL = "py-2 pads 8px above the label";
const ROW_CORNER_LABEL = "4px radius on the row, not the panel";
const WRAPPED_PAD_LABEL = "p-0! leaves only the menu's p-1";
const WRAPPED_EDGE_LABEL = "the popover brings the border";
const DROPPED_LABEL = "the class is dropped";
const WIDTH_FAULT_LABEL = "w-64 asks 256px, it renders 175px";
const WRAPPED_CODE = 'pt:content:class="p-0! min-w-60"';
const BARE_CODE = 'class="w-64 shadow-md"';
const BARE_TOKEN = "w-64 shadow-md";

export const menuSpecimens = async (tone: Tone) => {
  const c = (key: string) => tint(tone, key);

  const span = async (icon: string) => glyphSpan(icon, ICON);

  const search = await span("magnifying-glass");
  const sliders = await span("sliders");
  const trash = await span("trash");
  const copy = await span("copy");
  const pen = await span("pen");
  const file = await span("file");
  const floppy = await span("floppy-disk");
  const caret = await span("caret-right");

  const contextSpan = (icon: number, text: string, trailing: number) =>
    PANEL_PAD * 2 +
    CONTEXT_PAD_X * 2 +
    icon +
    FLEX_GAP * 2 +
    textWidth(text, BODY) +
    TRAILING_PAD * 2 +
    trailing;

  const menuSpan = (icon: number, text: string) =>
    PANEL_PAD * 2 + MENU_PAD_X * 2 + icon + FLEX_GAP + textWidth(text, BODY);

  const panelWidth = (spans: readonly number[]) =>
    Math.max(MIN_PANEL, Math.ceil(Math.max(...spans)));

  const contextRow = async (
    x: number,
    y: number,
    w: number,
    icon: string,
    text: string,
    trailing: string,
    colour: string,
    fill?: string,
  ) => {
    const iconSpan = await span(icon);
    const iconX = x + PANEL_PAD + CONTEXT_PAD_X;
    const trailingX = x + w - PANEL_PAD - CONTEXT_PAD_X - TRAILING_PAD;
    return (
      (fill === undefined
        ? ""
        : plate(x + PANEL_PAD, y, w - PANEL_PAD * 2, CONTEXT_ROW, {
            fill,
            radius: ROW_CORNER,
          })) +
      (await glyph(
        icon,
        iconX,
        round(y + (CONTEXT_ROW - ICON) / 2),
        ICON,
        colour,
      )) +
      ink(
        round(iconX + iconSpan + FLEX_GAP),
        centre(y, CONTEXT_ROW, BODY),
        text,
        BODY,
        colour,
      ) +
      (trailing === ""
        ? ""
        : ink(
            round(trailingX - textWidth(trailing, BODY)),
            centre(y, CONTEXT_ROW, BODY),
            trailing,
            BODY,
            c("subtleFg"),
          ))
    );
  };

  const menuRow = async (
    x: number,
    y: number,
    w: number,
    icon: string,
    text: string,
    colour: string,
    fill?: string,
  ) => {
    const iconSpan = await span(icon);
    const iconX = x + PANEL_PAD + MENU_PAD_X;
    return (
      (fill === undefined
        ? ""
        : plate(x + PANEL_PAD, y, w - PANEL_PAD * 2, MENU_ROW, {
            fill,
            radius: ROW_CORNER,
          })) +
      (await glyph(icon, iconX, round(y + (MENU_ROW - ICON) / 2), ICON, colour)) +
      ink(
        round(iconX + iconSpan + FLEX_GAP),
        centre(y, MENU_ROW, BODY),
        text,
        BODY,
        colour,
      )
    );
  };

  const contextWidth = panelWidth([
    contextSpan(search, "Search", textWidth("Ctrl F", BODY)),
    contextSpan(sliders, "Settings", 0),
    contextSpan(trash, "Delete", textWidth("Del", BODY)),
  ]);

  const contextFirst = PANEL_PAD;
  const contextSecond = contextFirst + CONTEXT_ROW + ITEM_GAP;
  const contextRule = contextSecond + CONTEXT_ROW + ITEM_MARGIN;
  const contextThird = contextRule + SEPARATOR + ITEM_MARGIN;
  const contextHeight = contextThird + CONTEXT_ROW + ITEM_MARGIN + PANEL_PAD;

  const contextPanel =
    plate(0, 0, contextWidth, contextHeight, {
      fill: c("page"),
      stroke: c("edge"),
      radius: RADIUS,
    }) +
    (await contextRow(
      0,
      contextFirst,
      contextWidth,
      "magnifying-glass",
      "Search",
      "Ctrl F",
      c("strong"),
    )) +
    (await contextRow(
      0,
      contextSecond,
      contextWidth,
      "sliders",
      "Settings",
      "",
      c("strong"),
      c("hover"),
    )) +
    plate(PANEL_PAD, contextRule, contextWidth - PANEL_PAD * 2, SEPARATOR, {
      fill: c("edge"),
    }) +
    (await contextRow(
      0,
      contextThird,
      contextWidth,
      "trash",
      "Delete",
      "Del",
      c("fgDanger"),
    ));

  const contextLead = region(
    tone,
    "padding",
    PANEL_PAD,
    contextFirst,
    CONTEXT_PAD_X,
    CONTEXT_ROW,
  );
  const contextTop = region(
    tone,
    "padding",
    PANEL_PAD,
    contextSecond,
    contextWidth - PANEL_PAD * 2,
    CONTEXT_PAD_Y,
  );
  const contextEdge = region(
    tone,
    "border",
    contextWidth - BORDER,
    round(contextFirst + (CONTEXT_ROW - EDGE_TICK) / 2),
    BORDER,
    EDGE_TICK,
  );
  const contextSeam = region(
    tone,
    "border",
    contextWidth - PANEL_PAD - SEPARATOR_MARK,
    contextRule,
    SEPARATOR_MARK,
    SEPARATOR,
  );

  const context = bare(
    contextPanel +
      contextLead.draw +
      contextTop.draw +
      contextEdge.draw +
      contextSeam.draw,
  );

  const parentWidth = panelWidth([
    contextSpan(search, "Search", 0),
    contextSpan(copy, "Copy", caret),
    contextSpan(pen, "Rename", 0),
  ]);

  const parentFirst = PANEL_PAD;
  const parentSecond = parentFirst + CONTEXT_ROW + ITEM_GAP;
  const parentThird = parentSecond + CONTEXT_ROW + ITEM_GAP;
  const parentHeight = parentThird + CONTEXT_ROW + ITEM_MARGIN + PANEL_PAD;

  const flyoutWidth = Math.ceil(
    Math.max(contextSpan(copy, "URL", 0), contextSpan(file, "Raw", 0)),
  );
  const flyoutTop = parentSecond - ITEM_MARGIN;
  const flyoutFirst = flyoutTop + PANEL_PAD;
  const flyoutSecond = flyoutFirst + CONTEXT_ROW + ITEM_GAP;
  const flyoutHeight =
    flyoutSecond + CONTEXT_ROW + ITEM_MARGIN + PANEL_PAD - flyoutTop;

  const parentPanel =
    plate(0, 0, parentWidth, parentHeight, {
      fill: c("page"),
      stroke: c("edge"),
      radius: RADIUS,
    }) +
    (await contextRow(
      0,
      parentFirst,
      parentWidth,
      "magnifying-glass",
      "Search",
      "",
      c("strong"),
    )) +
    (await contextRow(
      0,
      parentSecond,
      parentWidth,
      "copy",
      "Copy",
      "",
      c("strong"),
      c("selected"),
    )) +
    (await glyph(
      "caret-right",
      round(parentWidth - PANEL_PAD - CONTEXT_PAD_X - TRAILING_PAD - caret),
      round(parentSecond + (CONTEXT_ROW - ICON) / 2),
      ICON,
      c("subtleFg"),
    )) +
    (await contextRow(
      0,
      parentThird,
      parentWidth,
      "pen",
      "Rename",
      "",
      c("strong"),
    ));

  const flyoutPanel =
    plate(parentWidth, flyoutTop, flyoutWidth, flyoutHeight, {
      fill: c("page"),
      stroke: c("edge"),
      radius: RADIUS,
    }) +
    (await contextRow(
      parentWidth,
      flyoutFirst,
      flyoutWidth,
      "copy",
      "URL",
      "",
      c("strong"),
    )) +
    (await contextRow(
      parentWidth,
      flyoutSecond,
      flyoutWidth,
      "file",
      "Raw",
      "",
      c("strong"),
    ));

  const parentGap = region(
    tone,
    "gap",
    PANEL_PAD,
    parentFirst + CONTEXT_ROW,
    parentWidth - PANEL_PAD * 2,
    ITEM_GAP,
  );
  const flyoutEdge = region(
    tone,
    "border",
    parentWidth + flyoutWidth - BORDER,
    round(flyoutFirst + (CONTEXT_ROW - EDGE_TICK) / 2),
    BORDER,
    EDGE_TICK,
  );

  const submenu = bare(
    parentPanel + flyoutPanel + parentGap.draw + flyoutEdge.draw,
  );

  const menuWidth = panelWidth([
    menuSpan(search, "Search"),
    menuSpan(floppy, "Save"),
    menuSpan(sliders, "Settings"),
  ]);

  const menuX = PLATE_PAD;
  const menuY = PLATE_PAD;
  const sectionLabelY = menuY + PANEL_PAD;
  const sectionFirst = sectionLabelY + SECTION_ROW + ITEM_MARGIN;
  const sectionSecond = sectionFirst + MENU_ROW + ITEM_MARGIN;
  const sectionThird = sectionSecond + MENU_ROW + ITEM_MARGIN;
  const menuHeight =
    sectionThird + MENU_ROW + ITEM_MARGIN + PANEL_PAD - menuY;
  const plateWidth = menuWidth + PLATE_PAD * 2;
  const plateHeight = menuHeight + PLATE_PAD * 2;

  const sectionPlate =
    plate(0, 0, plateWidth, plateHeight, {
      fill: c("raised"),
      radius: RADIUS,
    }) +
    ink(
      menuX + PANEL_PAD,
      centre(sectionLabelY, SECTION_ROW, BODY),
      "Recent",
      BODY,
      c("muted"),
    ) +
    (await menuRow(
      menuX,
      sectionFirst,
      menuWidth,
      "magnifying-glass",
      "Search",
      c("fg"),
    )) +
    (await menuRow(
      menuX,
      sectionSecond,
      menuWidth,
      "floppy-disk",
      "Save",
      c("fg"),
      c("hover"),
    )) +
    (await menuRow(
      menuX,
      sectionThird,
      menuWidth,
      "sliders",
      "Settings",
      c("subtleFg"),
    ));

  const sectionLead = region(
    tone,
    "padding",
    menuX + PANEL_PAD,
    sectionFirst,
    MENU_PAD_X,
    MENU_ROW,
  );
  const sectionTop = region(
    tone,
    "padding",
    menuX + PANEL_PAD,
    sectionSecond,
    menuWidth - PANEL_PAD * 2,
    MENU_PAD_Y,
  );
  const sectionCorner = region(
    tone,
    "border",
    menuX + menuWidth - PANEL_PAD - ROW_CORNER * 2,
    sectionSecond + MENU_ROW - ROW_CORNER * 2,
    ROW_CORNER * 2,
    ROW_CORNER * 2,
  );

  const sections = bare(
    sectionPlate + sectionLead.draw + sectionTop.draw + sectionCorner.draw,
  );

  const styledFirst = BORDER + PANEL_PAD;
  const styledSecond = styledFirst + MENU_ROW + ITEM_MARGIN;
  const styledHeight =
    styledSecond + MENU_ROW + ITEM_MARGIN + PANEL_PAD + BORDER;

  const wrappedPanel =
    plate(0, 0, POPOVER, styledHeight, {
      fill: c("page"),
      stroke: c("edge"),
      radius: RADIUS,
    }) +
    (await menuRow(
      BORDER,
      styledFirst,
      POPOVER - BORDER * 2,
      "magnifying-glass",
      "Search",
      c("fg"),
    )) +
    (await menuRow(
      BORDER,
      styledSecond,
      POPOVER - BORDER * 2,
      "sliders",
      "Settings",
      c("fg"),
    ));

  const wrappedPad = region(
    tone,
    "padding",
    BORDER,
    BORDER,
    PANEL_PAD,
    styledHeight - BORDER * 2,
  );
  const wrappedEdge = region(
    tone,
    "border",
    POPOVER - BORDER,
    round((styledHeight - EDGE_TICK) / 2),
    BORDER,
    EDGE_TICK,
  );

  const wrappedAxis = round(POPOVER / 2);
  const wrappedCodeY = styledHeight + GAP + CAPTION;
  const wrappedCode = code(
    tone,
    wrappedAxis,
    wrappedCodeY,
    WRAPPED_CODE,
    { anchor: "middle" },
  );

  const wrapped = bare(
    wrappedPanel + wrappedPad.draw + wrappedEdge.draw + wrappedCode,
  );

  const barePanel =
    plate(0, 0, MIN_PANEL, styledHeight, {
      stroke: c("line"),
      dash: "3 2",
      radius: RADIUS,
    }) +
    (await menuRow(
      0,
      styledFirst,
      MIN_PANEL,
      "magnifying-glass",
      "Search",
      c("fg"),
    )) +
    (await menuRow(0, styledSecond, MIN_PANEL, "sliders", "Settings", c("fg")));

  const widthFault = region(
    tone,
    "fault",
    MIN_PANEL,
    0,
    ASKED - MIN_PANEL,
    styledHeight,
  );

  const bareAxis = round(ASKED / 2);
  const bareCodeX = round(bareAxis - textWidth(BARE_CODE, CAPTION) / 2);
  const bareCode = code(tone, bareCodeX, wrappedCodeY, BARE_CODE);
  const bareToken = markToken(
    tone,
    "fault",
    bareCodeX,
    wrappedCodeY,
    BARE_CODE,
    BARE_TOKEN,
  );

  const dropped = bare(
    barePanel + widthFault.draw + bareCode + bareToken.draw,
  );

  return {
    "component-menu-contextmenu":
      context.draw +
      annotate(
        tone,
        context.columns,
        "left",
        contextLead,
        contextFirst + HALF_ROW,
        CONTEXT_PAD_X_LABEL,
        "code",
        "key",
      ) +
      annotate(
        tone,
        context.columns,
        "left",
        contextTop,
        contextSecond + CONTEXT_PAD_Y / 2,
        CONTEXT_PAD_Y_LABEL,
      ) +
      annotate(
        tone,
        context.columns,
        "right",
        contextEdge,
        contextFirst + HALF_ROW,
        PANEL_EDGE_LABEL,
        "prose",
      ) +
      annotate(
        tone,
        context.columns,
        "right",
        contextSeam,
        contextRule,
        SEPARATOR_LABEL,
        "prose",
      ),

    "component-menu-submenu":
      submenu.draw +
      annotate(
        tone,
        submenu.columns,
        "left",
        parentGap,
        parentFirst + CONTEXT_ROW + ITEM_MARGIN,
        ROW_GAP_LABEL,
        "prose",
      ) +
      annotate(
        tone,
        submenu.columns,
        "right",
        flyoutEdge,
        flyoutFirst + HALF_ROW,
        FLYOUT_EDGE_LABEL,
        "prose",
        "key",
      ) +
      note(
        tone,
        submenu.axis,
        round(submenu.box.y2 + GAP + CAPTION),
        SUBMENU_NOTE,
      ),

    "component-menu-sections":
      sections.draw +
      annotate(
        tone,
        sections.columns,
        "left",
        sectionLead,
        round(sectionFirst + MENU_ROW / 2),
        MENU_PAD_X_LABEL,
      ) +
      annotate(
        tone,
        sections.columns,
        "left",
        sectionTop,
        sectionSecond + MENU_PAD_Y / 2,
        MENU_PAD_Y_LABEL,
        "code",
        "key",
      ) +
      annotate(
        tone,
        sections.columns,
        "right",
        sectionCorner,
        sectionSecond + MENU_ROW - ROW_CORNER,
        ROW_CORNER_LABEL,
        "prose",
      ),

    "component-menu-styling-do":
      wrapped.draw +
      annotate(
        tone,
        wrapped.columns,
        "left",
        wrappedPad,
        round(styledHeight / 2),
        WRAPPED_PAD_LABEL,
      ) +
      annotate(
        tone,
        wrapped.columns,
        "right",
        wrappedEdge,
        round(styledHeight / 2),
        WRAPPED_EDGE_LABEL,
        "prose",
        "key",
      ),

    "component-menu-styling-dont":
      dropped.draw +
      annotate(
        tone,
        dropped.columns,
        "left",
        bareToken,
        wrappedCodeY + LABEL_DROP,
        DROPPED_LABEL,
        "prose",
      ) +
      annotate(
        tone,
        dropped.columns,
        "right",
        widthFault,
        round(styledHeight / 2),
        WIDTH_FAULT_LABEL,
        "code",
        "key",
      ),
  };
};
