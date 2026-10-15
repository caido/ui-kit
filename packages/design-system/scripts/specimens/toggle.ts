import type { Region, Role, Slot, Tone } from "./kit.ts";
import {
  CAPTION,
  GAP,
  GRID,
  OUTLINE,
  RADIUS,
  VEIL,
  annotate,
  bare,
  code,
  decoded,
  disc,
  escaped,
  hatch,
  markToken,
  note,
  oneLineRow,
  plate,
  prose,
  region,
  roleColour,
  round,
  slotWidth,
  textWidth,
  tint,
} from "./kit.ts";

const TRACK_W = GRID * 10;

const TRACK_H = GRID * 6;

const BORDER = 1;

const KNOB = GRID * 4;

const KNOB_INSET = GRID;

const TRAVEL = GRID * 4;

const OFF_INSET = BORDER + KNOB_INSET;

const ON_INSET = TRACK_W - BORDER - KNOB_INSET - TRAVEL - KNOB;

const RING = 2;

const RING_OFFSET = 2;

const RING_SPAN = TRACK_W + (RING + RING_OFFSET) * 2;

const SCALE = 2;

const TRACK_SPAN = TRACK_W * SCALE;

const TRACK_RISE = TRACK_H * SCALE;

const CAP = TRACK_RISE / 2;

const AXIS = 400;

const CELL_W = GRID * 50;

const CELL_H = GRID * 10;

const CAPTION_DROP = GRID * 4;

const NOTE_DROP = GRID * 6;

const ABOVE = GRID * 12;

const CODE_BASE = CAPTION;

const CELL_TOP = GRID * 7;

const CAPTION_BASE = round(TRACK_H + CAPTION_DROP + CAPTION * 0.35);

const MID = TRACK_H / 2;

const CELL_MID = round(CELL_TOP + (CELL_H - TRACK_H) / 2);

const OFF_BORDER_LABEL = "line-strong draws the border when off";

const ON_BORDER_LABEL = "on drops the border entirely";

const DEFAULT_NOTE = "off is surface-subtle, on is fill-secondary";

const TRAIL_LABEL = "5px behind the knob when off";

const LEAD_LABEL = "3px ahead of the knob when on";

const TRAVEL_LABEL = "16px of travel, the knob's own width";

const ANATOMY_NOTE = "drawn at 2x, with the 1px border inside the width";

const RING_LABEL = "the ring sits 2px outside the track";

const STATES_NOTE = "hover moves the fill, disabled fades the switch";

const CENTRE_LABEL = "justify-center splits the slack evenly";

const SLACK_LABEL = "the slack all lands on one side";

const CENTRE_CODE = escaped('class="flex justify-center"');

const ALIGN_CODE = escaped('class="text-center"');

const PUSH_LABEL = "ml-auto pushes the switch to the end";

const DROPPED_LABEL = "dropped, because inheritAttrs is false";

const WRAP_CODE = escaped('<div class="ml-auto"><CToggle /></div>');

const ATTR_CODE = escaped('<CToggle class="ml-auto" />');

const ATTR_TOKEN = escaped('class="ml-auto"');

const WRAP_NOTE = "the wrapper carries the alignment";

const ATTR_NOTE = "nothing class-shaped survives the API";

export const toggleSpecimens = (tone: Tone) => {
  const c = (key: string) => tint(tone, key);

  const trackAt = (
    x: number,
    y: number,
    scale: number,
    fill: string,
    stroke?: string,
  ) =>
    plate(x, y, TRACK_W * scale, TRACK_H * scale, {
      fill,
      stroke,
      radius: (TRACK_H * scale) / 2,
    });

  const knobAt = (x: number, y: number, scale: number, inset: number, fill: string) =>
    disc(
      round(x + inset * scale),
      round(y + (TRACK_H * scale) / 2),
      (KNOB / 2) * scale,
      { fill },
    );

  const offSwitch = (x: number, y: number, scale = 1, fill = c("subtle")) =>
    trackAt(x, y, scale, fill, c("lineStrong")) +
    knobAt(x, y, scale, OFF_INSET + KNOB / 2, c("fillNeutral"));

  const onSwitch = (x: number, y: number, scale = 1, fill = c("accent")) =>
    trackAt(x, y, scale, fill) +
    knobAt(x, y, scale, TRACK_W - ON_INSET - KNOB / 2, c("onSecondary"));

  const veilAt = (x: number, y: number) =>
    plate(x, y, TRACK_W, TRACK_H, {
      fill: c("page"),
      opacity: VEIL,
      radius: TRACK_H / 2,
    });

  const ringAt = (x: number, y: number) =>
    plate(
      round(x - RING_OFFSET - RING / 2),
      round(y - RING_OFFSET - RING / 2),
      TRACK_W + RING_OFFSET * 2 + RING,
      TRACK_H + RING_OFFSET * 2 + RING,
      {
        stroke: c("focus"),
        weight: RING,
        radius: (TRACK_H + RING_OFFSET * 2 + RING) / 2,
      },
    );

  const cellAt = (y: number) =>
    plate(0, y, CELL_W, CELL_H, {
      stroke: c("edge"),
      dash: "4 3",
      radius: RADIUS,
    });

  const centredCode = (y: number, text: string) =>
    code(
      tone,
      round(CELL_W / 2 - textWidth(decoded(text), CAPTION) / 2),
      y,
      text,
    );

  const centredProse = (y: number, text: string) =>
    prose(tone, round(CELL_W / 2), y, text, { anchor: "middle" });

  let defaultOffX = 0;
  let defaultOnX = 0;
  const defaultSlots: Slot[] = [
    {
      width: slotWidth(TRACK_W, "off", CAPTION),
      draw: (axis, y) => {
        defaultOffX = round(axis - TRACK_W / 2);
        return (
          offSwitch(defaultOffX, y) +
          prose(tone, axis, round(y + CAPTION_BASE), "off", {
            anchor: "middle",
          })
        );
      },
    },
    {
      width: slotWidth(TRACK_W, "on", CAPTION),
      draw: (axis, y) => {
        defaultOnX = round(axis - TRACK_W / 2);
        return (
          onSwitch(defaultOnX, y) +
          prose(tone, axis, round(y + CAPTION_BASE), "on", {
            anchor: "middle",
          })
        );
      },
    },
  ];
  const defaultRow = oneLineRow(defaultSlots, AXIS, 0);
  const offEdge = region(tone, "border", defaultOffX, 0, TRACK_W, TRACK_H);
  const onEdge = region(tone, "border", defaultOnX, 0, TRACK_W, TRACK_H);
  const pair = bare(defaultRow + offEdge.draw + onEdge.draw);

  const anatomyOnX = round(TRACK_W * SCALE + GAP);

  const capStart = (trackX: number) => trackX + CAP;

  const capEnd = (trackX: number) => trackX + TRACK_SPAN - CAP;

  const halfRise = (trackX: number, x: number) => {
    if (x < capStart(trackX)) {
      return Math.sqrt(CAP ** 2 - (capStart(trackX) - x) ** 2);
    }
    if (x > capEnd(trackX)) {
      return Math.sqrt(CAP ** 2 - (x - capEnd(trackX)) ** 2);
    }
    return CAP;
  };

  const edgeY = (trackX: number, x: number, below: boolean) =>
    round(CAP + halfRise(trackX, x) * (below ? 1 : -1));

  const stops = (trackX: number, from: number, to: number) => [
    from,
    ...[capStart(trackX), capEnd(trackX)].filter(
      (edge) => edge > from && edge < to,
    ),
    to,
  ];

  const legs = (line: readonly number[]) =>
    line.slice(1).map((to, index) => ({ from: line[index] ?? to, to }));

  const rounded = (trackX: number, from: number, to: number) =>
    to <= capStart(trackX) || from >= capEnd(trackX);

  const leg = (trackX: number, from: number, to: number, below: boolean) => {
    const end = `${round(to)} ${edgeY(trackX, to, below)}`;
    return rounded(trackX, Math.min(from, to), Math.max(from, to))
      ? ` A ${CAP} ${CAP} 0 0 1 ${end}`
      : ` L ${end}`;
  };

  const pillSlab = (trackX: number, from: number, to: number) => {
    const line = stops(trackX, from, to);
    const over = legs(line);
    const under = [...over].reverse();
    return (
      `M ${round(from)} ${edgeY(trackX, from, false)}` +
      over.map((seg) => leg(trackX, seg.from, seg.to, false)).join("") +
      ` L ${round(to)} ${edgeY(trackX, to, true)}` +
      under.map((seg) => leg(trackX, seg.to, seg.from, true)).join("") +
      " Z"
    );
  };

  const insideTrack = (
    role: Role,
    ink: string,
    trackX: number,
    from: number,
    to: number,
  ): Region => {
    const colour = roleColour(tone, role);
    const id = `slab-${role}-${[trackX, from, to].join("-")}`;
    const d = pillSlab(trackX, from, to);
    return {
      draw:
        hatch(id, colour) +
        `\n  <path d="${d}" fill="url(#${id})"/>` +
        `\n  <path d="${d}" fill="none" stroke="${ink}" stroke-width="1" stroke-dasharray="3 2" stroke-opacity="${OUTLINE}"/>`,
      centre: { x: round((from + to) / 2), y: CAP },
      left: { x: round(from), y: CAP },
      right: { x: round(to), y: CAP },
    };
  };

  const offTrackInk = c("muted");
  const onTrackInk = c("onSecondary");
  const trailInset = insideTrack(
    "padding",
    offTrackInk,
    0,
    0,
    OFF_INSET * SCALE,
  );
  const leadInset = insideTrack(
    "padding",
    onTrackInk,
    anatomyOnX,
    round(anatomyOnX + (TRACK_W - ON_INSET) * SCALE),
    round(anatomyOnX + TRACK_SPAN),
  );
  const travelled = insideTrack(
    "gap",
    onTrackInk,
    anatomyOnX,
    round(anatomyOnX + OFF_INSET * SCALE),
    round(anatomyOnX + (OFF_INSET + TRAVEL) * SCALE),
  );
  const travelFoot = { x: travelled.centre.x, y: TRACK_RISE };
  const travelBase = round(TRACK_RISE + GRID * 4);
  const anatomy = bare(
    offSwitch(0, 0, SCALE) +
      onSwitch(anatomyOnX, 0, SCALE) +
      trailInset.draw +
      leadInset.draw +
      travelled.draw,
  );

  const states = [
    { name: "off", on: false, fill: c("subtle"), ring: false, veil: false },
    { name: "hover", on: false, fill: c("hover"), ring: false, veil: false },
    { name: "on", on: true, fill: c("accent"), ring: false, veil: false },
    {
      name: "hover",
      on: true,
      fill: c("fillSecondaryHover"),
      ring: false,
      veil: false,
    },
    { name: "focus", on: false, fill: c("subtle"), ring: true, veil: false },
    { name: "disabled", on: false, fill: c("subtle"), ring: false, veil: true },
  ];

  let focusX = 0;
  const stateRow = oneLineRow(
    states.map((state) => ({
      width: slotWidth(state.ring ? RING_SPAN : TRACK_W, state.name, CAPTION),
      draw: (axis: number, y: number) => {
        const left = round(axis - TRACK_W / 2);
        if (state.ring) focusX = left;
        return (
          (state.ring ? ringAt(left, y) : "") +
          (state.on
            ? onSwitch(left, y, 1, state.fill)
            : offSwitch(left, y, 1, state.fill)) +
          (state.veil ? veilAt(left, y) : "") +
          prose(tone, axis, round(y + CAPTION_BASE), state.name, {
            anchor: "middle",
          })
        );
      },
    })),
    AXIS,
    0,
  );
  const ringEdge = region(
    tone,
    "border",
    round(focusX - RING_OFFSET - RING),
    round(-RING_OFFSET - RING),
    TRACK_W + (RING_OFFSET + RING) * 2,
    TRACK_H + (RING_OFFSET + RING) * 2,
  );
  const stateColumns = {
    left: round(focusX - GAP),
    right: round(focusX + TRACK_W + GAP),
  };
  const stateGroup = bare(stateRow + ringEdge.draw);

  const centredSlack = region(
    tone,
    "gap",
    0,
    CELL_MID,
    round((CELL_W - TRACK_W) / 2),
    TRACK_H,
  );
  const centredDrawing =
    cellAt(CELL_TOP) +
    onSwitch(round((CELL_W - TRACK_W) / 2), CELL_MID) +
    centredSlack.draw +
    region(
      tone,
      "gap",
      round((CELL_W + TRACK_W) / 2),
      CELL_MID,
      round((CELL_W - TRACK_W) / 2),
      TRACK_H,
    ).draw;
  const centred = bare(centredDrawing);

  const slack = region(
    tone,
    "fault",
    TRACK_W,
    CELL_MID,
    CELL_W - TRACK_W,
    TRACK_H,
  );
  const leading = bare(cellAt(CELL_TOP) + onSwitch(0, CELL_MID) + slack.draw);

  const pushed = region(tone, "gap", 0, CELL_MID, CELL_W - TRACK_W, TRACK_H);
  const wrapped = bare(
    centredCode(CODE_BASE, WRAP_CODE) +
      cellAt(CELL_TOP) +
      onSwitch(CELL_W - TRACK_W, CELL_MID) +
      pushed.draw,
  );

  const attrX = round(CELL_W / 2 - textWidth(decoded(ATTR_CODE), CAPTION) / 2);
  const attrDrawing =
    centredCode(CODE_BASE, ATTR_CODE) + cellAt(CELL_TOP) + onSwitch(0, CELL_MID);
  const dropped = markToken(
    tone,
    "fault",
    attrX,
    CODE_BASE,
    ATTR_CODE,
    ATTR_TOKEN,
  );
  const attr = bare(attrDrawing + dropped.draw);

  return {
    "component-toggle-default":
      pair.draw +
      annotate(tone, pair.columns, "left", offEdge, MID, OFF_BORDER_LABEL) +
      annotate(
        tone,
        pair.columns,
        "right",
        onEdge,
        MID,
        ON_BORDER_LABEL,
        "prose",
      ) +
      note(tone, AXIS, round(CAPTION_BASE + NOTE_DROP), DEFAULT_NOTE),

    "component-toggle-anatomy":
      anatomy.draw +
      annotate(tone, anatomy.columns, "left", trailInset, CAP, TRAIL_LABEL) +
      annotate(tone, anatomy.columns, "right", leadInset, CAP, LEAD_LABEL) +
      annotate(
        tone,
        anatomy.columns,
        "right",
        travelFoot,
        travelBase,
        TRAVEL_LABEL,
      ) +
      note(tone, anatomy.axis, round(travelBase + NOTE_DROP), ANATOMY_NOTE),

    "component-toggle-states":
      stateGroup.draw +
      annotate(
        tone,
        stateColumns,
        "left",
        ringEdge,
        -ABOVE,
        RING_LABEL,
        "prose",
      ) +
      note(tone, AXIS, round(CAPTION_BASE + NOTE_DROP), STATES_NOTE),

    "component-toggle-position-do":
      centred.draw +
      annotate(
        tone,
        centred.columns,
        "left",
        centredSlack,
        round(CELL_MID + MID),
        CENTRE_LABEL,
      ) +
      centredCode(round(CELL_TOP + CELL_H + NOTE_DROP), CENTRE_CODE),

    "component-toggle-position-dont":
      leading.draw +
      annotate(
        tone,
        leading.columns,
        "right",
        slack,
        round(CELL_MID + MID),
        SLACK_LABEL,
        "prose",
      ) +
      centredCode(round(CELL_TOP + CELL_H + NOTE_DROP), ALIGN_CODE),

    "component-toggle-class-do":
      wrapped.draw +
      annotate(
        tone,
        wrapped.columns,
        "left",
        pushed,
        round(CELL_MID + MID),
        PUSH_LABEL,
      ) +
      centredProse(round(CELL_TOP + CELL_H + NOTE_DROP), WRAP_NOTE),

    "component-toggle-class-dont":
      attr.draw +
      annotate(
        tone,
        attr.columns,
        "right",
        dropped,
        dropped.centre.y,
        DROPPED_LABEL,
        "prose",
      ) +
      centredProse(round(CELL_TOP + CELL_H + NOTE_DROP), ATTR_NOTE),
  };
};
