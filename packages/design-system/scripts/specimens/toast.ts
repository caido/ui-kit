import type { Slot, Tone } from "./kit.ts";
import {
  annotate,
  bare,
  BODY,
  CAPTION,
  centre,
  code,
  disc,
  glyph,
  glyphSpan,
  GRID,
  ink,
  MEDIUM,
  note,
  OFFSET,
  oneLineRow,
  OUTLINE,
  plate,
  RADIUS,
  region,
  roleColour,
  round,
  rule,
  textWidth,
  tint,
  underline,
} from "./kit.ts";

const TOAST_WIDTH = GRID * 96;

const PADDING = GRID * 3;

const ROOT_SIZE = BODY;

const ICON = ROOT_SIZE * 1.125;

const ICON_GAP = GRID * 4;

const TEXT_X = PADDING + ICON + ICON_GAP;

const PLAIN_TEXT_X = PADDING + GRID * 2;

const SUMMARY_LINE = 17;

const DETAIL_LINE = GRID * 4;

const DETAIL_GAP = GRID * 2;

const SUMMARY_HEIGHT = PADDING * 2 + SUMMARY_LINE;

const FULL_HEIGHT = SUMMARY_HEIGHT + DETAIL_GAP + DETAIL_LINE;

const CLOSE = GRID * 7;

const CLOSE_GLYPH = 14;

const CLOSE_X = TOAST_WIDTH - PADDING - CLOSE;

const STACK_GAP = GRID * 4;

const SCREEN_GAP = GRID * 9;

const AXIS = TOAST_WIDTH / 2;

const UNDERLINE_DROP = GRID;

type Severity = {
  name: string;
  fill: string;
  fg: string;
  icon: string | undefined;
};

const SEVERITIES: Severity[] = [
  {
    name: "info",
    fill: "toastInfo",
    fg: "fgInfoStrong",
    icon: "circle-info",
  },
  {
    name: "success",
    fill: "toastSuccess",
    fg: "fgSuccessStrong",
    icon: "circle-check",
  },
  {
    name: "warn",
    fill: "toastWarn",
    fg: "fgWarnStrong",
    icon: "triangle-exclamation",
  },
  {
    name: "error",
    fill: "toastDanger",
    fg: "fgDangerStrong",
    icon: "circle-xmark",
  },
  { name: "secondary", fill: "raised", fg: "fg", icon: undefined },
  {
    name: "contrast",
    fill: "neutralSubtle",
    fg: "onNeutralSubtle",
    icon: undefined,
  },
];

const severityBy = (name: string) => {
  const found = SEVERITIES.find((severity) => severity.name === name);
  if (found === undefined) throw new Error(`unknown toast severity: ${name}`);
  return found;
};

const swatchWidth = (severity: Severity) =>
  round(
    (severity.icon === undefined ? PLAIN_TEXT_X : TEXT_X) +
      textWidth(severity.name, BODY) +
      PADDING,
  );

const placed = (widths: number[], axis: number) => {
  const centres: number[] = [];
  const slots: Slot[] = widths.map((width) => ({
    width,
    draw: (at: number) => {
      centres.push(at);
      return "";
    },
  }));
  oneLineRow(slots, axis, 0);
  return centres;
};

export const toastSpecimens = async (tone: Tone) => {
  const c = (key: string) => tint(tone, key);
  const closeGlyph = await glyphSpan("xmark", CLOSE_GLYPH);

  const shell = (x: number, y: number, height: number, fill: string) =>
    plate(x, y, TOAST_WIDTH, height, { fill, radius: RADIUS });

  const summaryBaseline = (y: number) =>
    centre(y + PADDING, SUMMARY_LINE, BODY);

  const detailBaseline = (y: number) =>
    centre(y + PADDING + SUMMARY_LINE + DETAIL_GAP, DETAIL_LINE, CAPTION);

  const summaryText = (
    x: number,
    y: number,
    text: string,
    colour: string,
    hasIcon: boolean,
  ) =>
    ink(
      x + (hasIcon ? TEXT_X : PLAIN_TEXT_X),
      summaryBaseline(y),
      text,
      BODY,
      colour,
      { weight: MEDIUM },
    );

  const detailText = (y: number, text: string, colour: string) =>
    ink(TEXT_X, detailBaseline(y), text, CAPTION, colour);

  const banner = async (y: number, severity: Severity, text: string) =>
    shell(0, y, SUMMARY_HEIGHT, c(severity.fill)) +
    (severity.icon === undefined
      ? ""
      : await glyph(
          severity.icon,
          PADDING,
          y + PADDING,
          ICON,
          c(severity.fg),
        )) +
    summaryText(0, y, text, c(severity.fg), severity.icon !== undefined);

  const swatch = async (mid: number, severity: Severity) => {
    const width = swatchWidth(severity);
    const x = round(mid - width / 2);
    return (
      plate(x, 0, width, SUMMARY_HEIGHT, {
        fill: c(severity.fill),
        radius: RADIUS,
      }) +
      (severity.icon === undefined
        ? ""
        : await glyph(
            severity.icon,
            x + PADDING,
            PADDING,
            ICON,
            c(severity.fg),
          )) +
      summaryText(
        x,
        0,
        severity.name,
        c(severity.fg),
        severity.icon !== undefined,
      )
    );
  };

  const pairing = async (
    glyphInk: string,
    summaryInk: string,
    detailInk: string,
  ) =>
    shell(0, 0, FULL_HEIGHT, c("toastInfo")) +
    (await glyph("circle-info", PADDING, PADDING, ICON, glyphInk)) +
    summaryText(0, 0, "Info", summaryInk, true) +
    detailText(0, "Project saved", detailInk);

  const subject =
    shell(0, 0, FULL_HEIGHT, c("toastDanger")) +
    (await glyph("circle-xmark", PADDING, PADDING, ICON, c("fgDangerStrong"))) +
    summaryText(0, 0, "Error", c("fgDangerStrong"), true) +
    detailText(0, "Connection refused", c("strong")) +
    (await glyph(
      "xmark",
      CLOSE_X + (CLOSE - closeGlyph) / 2,
      PADDING + (CLOSE - CLOSE_GLYPH) / 2,
      CLOSE_GLYPH,
      c("fgDangerStrong"),
    ));

  const view = bare(subject);

  const insidePadding = region(tone, "padding", 0, 0, PADDING, FULL_HEIGHT);
  const iconGap = region(tone, "gap", PADDING + ICON, 0, ICON_GAP, FULL_HEIGHT);
  const closeMid = { x: CLOSE_X + CLOSE / 2, y: PADDING + CLOSE / 2 };
  const closeRing = CLOSE / 2 + OFFSET;
  const closeBox = {
    draw: disc(closeMid.x, closeMid.y, closeRing, {
      stroke: roleColour(tone, "border"),
      weight: 1,
      opacity: OUTLINE,
    }),
    centre: { x: closeMid.x, y: round(closeMid.y - closeRing) },
    left: { x: round(closeMid.x - closeRing), y: closeMid.y },
    right: { x: round(closeMid.x + closeRing), y: closeMid.y },
  };

  const swatchWidths = SEVERITIES.map(swatchWidth);
  const swatchCentres = placed(swatchWidths, AXIS);
  let row = "";
  for (const [index, severity] of SEVERITIES.entries()) {
    const mid = swatchCentres[index];
    if (mid === undefined) throw new Error("the severity row lost an item");
    row += await swatch(mid, severity);
  }

  const stackTop = 0;
  const stackMiddle = SUMMARY_HEIGHT + STACK_GAP;
  const stackBottom = stackMiddle + SUMMARY_HEIGHT + STACK_GAP;
  const screenLine = stackBottom + SUMMARY_HEIGHT + SCREEN_GAP;

  const stack =
    (await banner(stackTop, severityBy("info"), "Info")) +
    (await banner(stackMiddle, severityBy("success"), "Success")) +
    (await banner(stackBottom, severityBy("error"), "Error"));

  const stackView = bare(stack);

  const betweenToasts = region(
    tone,
    "gap",
    0,
    stackMiddle - STACK_GAP,
    TOAST_WIDTH,
    STACK_GAP,
  );
  const secondGap = region(
    tone,
    "gap",
    0,
    stackBottom - STACK_GAP,
    TOAST_WIDTH,
    STACK_GAP,
  );
  const aboveBottom = region(
    tone,
    "gap",
    0,
    screenLine - SCREEN_GAP,
    TOAST_WIDTH,
    SCREEN_GAP,
  );

  const faultInk = (y: number, text: string, size: number, x: number) =>
    underline(
      tone,
      "fault",
      x,
      round(y + UNDERLINE_DROP),
      textWidth(text, size),
    ).draw;

  return {
    "component-toast-default":
      view.draw +
      insidePadding.draw +
      iconGap.draw +
      closeBox.draw +
      annotate(
        tone,
        view.columns,
        "left",
        insidePadding,
        round(FULL_HEIGHT / 2),
        "p-3 pads 12px each side",
        "code",
        "key",
      ) +
      annotate(
        tone,
        view.columns,
        "right",
        closeBox,
        closeBox.right.y,
        "close button 28px",
      ) +
      note(
        tone,
        view.axis,
        FULL_HEIGHT + GRID * 8,
        "the toast is 384px wide and draws no border",
      ),

    "component-toast-severities":
      row +
      note(
        tone,
        AXIS,
        SUMMARY_HEIGHT + GRID * 8,
        "secondary and contrast draw no icon",
      ),

    "component-toast-stack":
      stackView.draw +
      betweenToasts.draw +
      secondGap.draw +
      aboveBottom.draw +
      rule(
        stackView.columns.left,
        screenLine,
        stackView.columns.right,
        screenLine,
        c("edge"),
      ) +
      annotate(
        tone,
        stackView.columns,
        "left",
        betweenToasts,
        betweenToasts.left.y,
        "16px between toasts",
        "code",
        "key",
      ) +
      annotate(
        tone,
        stackView.columns,
        "right",
        aboveBottom,
        aboveBottom.right.y,
        "36px to the window bottom",
      ) +
      note(
        tone,
        stackView.axis,
        screenLine + GRID * 8,
        "bottom centre, three messages from the composable",
      ),

    "component-toast-contrast-do":
      (await pairing(c("fgInfoStrong"), c("fgInfoStrong"), c("strong"))) +
      code(
        tone,
        AXIS,
        FULL_HEIGHT + GRID * 8,
        "the toast surface takes fg-info-strong",
        { anchor: "middle" },
      ),

    "component-toast-contrast-dont":
      (await pairing(c("onInfo"), c("onInfo"), c("onInfo"))) +
      faultInk(summaryBaseline(0), "Info", BODY, TEXT_X) +
      faultInk(detailBaseline(0), "Project saved", CAPTION, TEXT_X) +
      code(
        tone,
        AXIS,
        FULL_HEIGHT + GRID * 8,
        "fg-on-info is measured on fill-info-strong",
        { anchor: "middle" },
      ),
  };
};
