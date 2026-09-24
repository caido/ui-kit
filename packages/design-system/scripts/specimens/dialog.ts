import type { Slot, Tone } from "./kit.ts";
import {
  annotate,
  bar,
  BODY,
  BOLD,
  CAPTION,
  centre,
  DIALOG_LG,
  DIALOG_MD,
  DIALOG_SM,
  dim,
  glyph,
  glyphSpan,
  GRID,
  ink,
  keyCode,
  keyProse,
  oneLineRow,
  plate,
  prose,
  RADIUS,
  region,
  resting,
  round,
  slotWidth,
  staged,
  tint,
} from "./kit.ts";

const PAD_4 = GRID * 4;

const GAP_2 = GRID * 2;

const CLOSE = GRID * 8;

const CROSS = GRID * 3.5;

const HEADER_H = PAD_4 + CLOSE + PAD_4;

const TEXT_H = GRID * 5;

const CONTENT_H = TEXT_H + PAD_4;

const ACTION_H = 35;

const FOOTER_H = ACTION_H + PAD_4;

const PANEL_X = GRID * 70;

const PANEL_Y = 0;

const PANEL_W = GRID * 48;

const PANEL_H = HEADER_H + CONTENT_H + FOOTER_H;

const CONTENT_Y = PANEL_Y + HEADER_H;

const FOOTER_Y = CONTENT_Y + CONTENT_H;

const CANCEL_W = GRID * 18;

const SAVE_W = GRID * 15;

const SAVE_X = PANEL_X + PANEL_W - PAD_4 - SAVE_W;

const GAP_X = SAVE_X - GAP_2;

const CANCEL_X = GAP_X - CANCEL_W;

const CLOSE_X = PANEL_X + PANEL_W - PAD_4 - CLOSE;

const CLOSE_Y = PANEL_Y + PAD_4;

const BELOW = PANEL_Y + PANEL_H + GRID * 3;

const SHOWN_LG = GRID * 50;

const SCALE = SHOWN_LG / DIALOG_LG;

const BAR_H = GRID * 10;

const FIT_W = GRID * 18;

const AXIS = GRID * 100;

const BAR_Y = 0;

const CAP_Y = BAR_Y + BAR_H + GRID * 6;

const NAME_Y = CAP_Y + GRID * 5;

const VIEWPORT = GRID * 360;

const WINDOW_W = GRID * 180;

const WINDOW_H = GRID * 32;

const SHOT_SCALE = WINDOW_W / VIEWPORT;

const CAP_W = round(DIALOG_MD * SHOT_SCALE);

const SHOT_H = round(PANEL_H * SHOT_SCALE);

const FIT_SHOT = GRID * 30;

const WINDOW_X = 0;

const WINDOW_Y = 0;

const CAP_X = round(WINDOW_X + (WINDOW_W - CAP_W) / 2);

const SHOT_Y = round(WINDOW_Y + (WINDOW_H - SHOT_H) / 2);

const FIT_X = round(WINDOW_X + (WINDOW_W - FIT_SHOT) / 2);

const HEADER_LABEL = "header p-4 on all four sides";

const CONTENT_LABEL = "content pb-4, and no padding on top";

const CLOSE_LABEL = "close button 32px, 1px border";

const FOOTER_LABEL = "footer actions sit gap-2 apart";

export const dialogSpecimens = async (tone: Tone) => {
  const c = (key: string) => tint(tone, key);
  const rest = resting(tone);

  const crossSpan = await glyphSpan("xmark", CROSS);

  const cross = await glyph(
    "xmark",
    round(CLOSE_X + (CLOSE - crossSpan) / 2),
    CLOSE_Y + (CLOSE - CROSS) / 2,
    CROSS,
    c("muted"),
  );

  const panel =
    plate(PANEL_X, PANEL_Y, PANEL_W, PANEL_H, {
      fill: c("page"),
      stroke: c("edge"),
      radius: RADIUS,
    }) +
    ink(
      PANEL_X + PAD_4,
      centre(PANEL_Y, HEADER_H, BODY),
      "Confirm",
      BODY,
      c("fg"),
      { weight: BOLD },
    ) +
    plate(CLOSE_X, CLOSE_Y, CLOSE, CLOSE, {
      stroke: c("edge"),
      radius: RADIUS,
    }) +
    cross +
    ink(
      PANEL_X + PAD_4,
      centre(CONTENT_Y, TEXT_H, BODY),
      "Replace request?",
      BODY,
      c("fg"),
    ) +
    plate(CANCEL_X, FOOTER_Y, CANCEL_W, ACTION_H, {
      stroke: c("edge"),
      radius: RADIUS,
    }) +
    ink(
      CANCEL_X + CANCEL_W / 2,
      centre(FOOTER_Y, ACTION_H, BODY),
      "Cancel",
      BODY,
      c("fg"),
      { anchor: "middle" },
    ) +
    plate(SAVE_X, FOOTER_Y, SAVE_W, ACTION_H, {
      fill: rest.fill,
      radius: RADIUS,
    }) +
    ink(
      SAVE_X + SAVE_W / 2,
      centre(FOOTER_Y, ACTION_H, BODY),
      "Save",
      BODY,
      rest.text,
      { anchor: "middle" },
    );

  const dialog = staged(tone, panel);

  const headerPad = region(tone, "padding", PANEL_X, PANEL_Y, PAD_4, HEADER_H);

  const contentPad = region(
    tone,
    "padding",
    PANEL_X,
    CONTENT_Y + TEXT_H,
    PANEL_W,
    PAD_4,
  );

  const closeEdge = region(tone, "border", CLOSE_X, CLOSE_Y, CLOSE, CLOSE);

  const footerGap = region(tone, "gap", GAP_X, FOOTER_Y, GAP_2, ACTION_H);

  const pane = (
    x: number,
    y: number,
    w: number,
    h: number,
    dashed: boolean,
  ) => {
    const part = (real: number) => Math.max(round((real * h) / PANEL_H), 2);
    const inset = part(PAD_4);
    const action = { w: part(SAVE_W), h: part(ACTION_H) };
    return (
      plate(x, y, w, h, {
        fill: c("page"),
        stroke: dashed ? c("lineStrong") : c("edge"),
        radius: RADIUS,
        dash: dashed ? "4 3" : undefined,
      }) +
      bar(
        x + inset,
        y + inset,
        Math.min(w - inset * 2, part(PANEL_W / 2)),
        part(TEXT_H),
        c("muted"),
      ) +
      bar(
        x + w - inset - action.w,
        y + h - inset - action.h,
        action.w,
        action.h,
        rest.fill,
      )
    );
  };

  const capped = (cap: number, name: string) => {
    const shown = round(cap * SCALE);
    const measure = `${cap}px cap`;
    return {
      width: Math.max(
        slotWidth(shown, measure, CAPTION),
        slotWidth(shown, name, CAPTION),
      ),
      shape: (middle: number) =>
        pane(round(middle - shown / 2), BAR_Y, shown, BAR_H, false),
      label: (middle: number) =>
        dim(round(middle - shown / 2), CAP_Y, shown, measure, c("muted")) +
        keyCode(tone, middle, NAME_Y, name, { anchor: "middle" }),
    };
  };

  const fitted = {
    width: Math.max(
      slotWidth(FIT_W, "fits content", CAPTION),
      slotWidth(FIT_W, "no width set", CAPTION),
    ),
    shape: (middle: number) =>
      pane(round(middle - FIT_W / 2), BAR_Y, FIT_W, BAR_H, true),
    label: (middle: number) =>
      prose(tone, middle, CAP_Y - GRID * 1.5, "fits content", {
        anchor: "middle",
      }) + keyProse(tone, middle, NAME_Y, "no width set", { anchor: "middle" }),
  };

  const caps = [
    capped(DIALOG_SM, "small"),
    capped(DIALOG_MD, "medium"),
    capped(DIALOG_LG, "large"),
    fitted,
  ];

  const shapes: Slot[] = caps.map((item) => ({
    width: item.width,
    draw: (middle: number) => item.shape(middle),
  }));

  const labels: Slot[] = caps.map((item) => ({
    width: item.width,
    draw: (middle: number) => item.label(middle),
  }));

  const viewport = plate(WINDOW_X, WINDOW_Y, WINDOW_W, WINDOW_H, {
    fill: c("subtle"),
    stroke: c("edge"),
    radius: RADIUS,
  });

  const missingLeft = region(
    tone,
    "fault",
    CAP_X,
    SHOT_Y,
    FIT_X - CAP_X,
    SHOT_H,
  );

  const missingRight = region(
    tone,
    "fault",
    FIT_X + FIT_SHOT,
    SHOT_Y,
    CAP_X + CAP_W - FIT_X - FIT_SHOT,
    SHOT_H,
  );

  return {
    "component-dialog-default":
      dialog.draw +
      headerPad.draw +
      contentPad.draw +
      closeEdge.draw +
      footerGap.draw +
      annotate(
        tone,
        dialog.columns,
        "left",
        headerPad,
        PANEL_Y + PAD_4,
        HEADER_LABEL,
      ) +
      annotate(
        tone,
        dialog.columns,
        "left",
        contentPad,
        round(CONTENT_Y + TEXT_H + PAD_4 / 2),
        CONTENT_LABEL,
        "code",
        "key",
      ) +
      annotate(
        tone,
        dialog.columns,
        "right",
        closeEdge,
        round(CLOSE_Y + CLOSE / 2),
        CLOSE_LABEL,
      ) +
      annotate(
        tone,
        dialog.columns,
        "right",
        footerGap.centre,
        BELOW,
        FOOTER_LABEL,
      ),

    "component-dialog-widths":
      oneLineRow(shapes, AXIS, BAR_Y) + oneLineRow(labels, AXIS, CAP_Y),

    "component-dialog-width-do":
      viewport + pane(CAP_X, SHOT_Y, CAP_W, SHOT_H, false),

    "component-dialog-width-dont":
      viewport +
      missingLeft.draw +
      missingRight.draw +
      pane(FIT_X, SHOT_Y, FIT_SHOT, SHOT_H, false),
  };
};
