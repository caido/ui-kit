import type { Slot, Tone } from "./kit.ts";
import {
  BODY,
  CAPTION,
  CARD_CORNER,
  GAP,
  GRID,
  MONO,
  RADIUS,
  annotate,
  bare,
  centre,
  code,
  escaped,
  glyph,
  glyphSpan,
  ink,
  markToken,
  note,
  oneLineRow,
  plate,
  region,
  round,
  textWidth,
  tint,
} from "./kit.ts";

const CELL_PAD_X = GRID * 4;

const HEADER_PAD_Y = GRID * 2;

const HEADER_GAP = GRID * 2;

const HEADER_HEIGHT = 36;

const HEADER_RULE = 4;

const HEADER_CONTENT = HEADER_HEIGHT - HEADER_PAD_Y * 2;

const ROW_HEIGHT = 24;

const ROW_RULE = 1;

const ROW_PITCH = ROW_HEIGHT;

const MARKER = 2;

const CARET_BOX = BODY;

const RESIZER = 7;

const GRAB = 31;

const GRAB_LEFT = GRID * 2;

const SKELETON_PAD_X = GRID * 2;

const SKELETON_HEIGHT = BODY;

const HOVER_WASH = 0.75;

const SELECTED_WASH = 0.2;

const TABLE_WIDTH = 272;

const STATE_WIDTH = 280;

const CELL_WIDTH = 160;

const CARD_WIDTH = 150;

const CARD_ROWS = 4;

const LIFT = GRID * 3.5;

const STEP = GRID * 7;

const NOTE_STEP = GRID * 7;

const LINE = GRID * 4;

export const tableSpecimens = async (tone: Tone) => {
  const c = (key: string) => tint(tone, key);
  const caretSpan = await glyphSpan("caret-down", CARET_BOX);
  const caret = (x: number, y: number) =>
    glyph(
      "caret-down",
      round(x + (CARET_BOX - caretSpan) / 2),
      y,
      CARET_BOX,
      c("fg"),
    );

  const rule = (x: number, y: number, w: number) =>
    plate(x, y, w, ROW_RULE, { fill: c("page") });

  const columns = [
    { heading: "Method", width: 84 },
    { heading: "Path", width: 104 },
    { heading: "Status", width: 84 },
  ];

  const records = [
    ["GET", "/login", "200"],
    ["POST", "/session", "201"],
    ["GET", "/health", "304"],
  ];

  const columnX = (index: number) =>
    columns.slice(0, index).reduce((sum, column) => sum + column.width, 0);

  const bodyTop = HEADER_HEIGHT + HEADER_RULE;
  const rowY = (index: number) => bodyTop + index * ROW_PITCH;
  const tableHeight = bodyTop + records.length * ROW_PITCH;

  const striped = (index: number) =>
    records.length % 2 === 0 ? index % 2 !== 0 : index % 2 === 0;

  const grid =
    plate(0, 0, TABLE_WIDTH, tableHeight, {
      fill: c("raised"),
      radius: CARD_CORNER,
    }) +
    columns
      .map(
        (column, index) =>
          ink(
            columnX(index) + CELL_PAD_X,
            centre(0, HEADER_HEIGHT, BODY),
            column.heading,
            BODY,
            c("fg"),
          ) +
          plate(columnX(index) + column.width - 1, 0, 1, HEADER_HEIGHT, {
            fill: c("page"),
          }),
      )
      .join("") +
    plate(0, HEADER_HEIGHT, TABLE_WIDTH, HEADER_RULE, { fill: c("page") }) +
    records
      .map(
        (record, index) =>
          (striped(index)
            ? plate(0, rowY(index), TABLE_WIDTH, ROW_HEIGHT, {
                fill: c("subtle"),
              })
            : "") +
          record
            .map((text, column) =>
              ink(
                MARKER + columnX(column) + CELL_PAD_X,
                centre(rowY(index), ROW_HEIGHT, BODY),
                text,
                BODY,
                c("fg"),
              ),
            )
            .join("") +
          rule(0, rowY(index) + ROW_HEIGHT - ROW_RULE, TABLE_WIDTH),
      )
      .join("");

  const cellPad = region(
    tone,
    "padding",
    MARKER,
    rowY(0),
    CELL_PAD_X,
    ROW_HEIGHT,
  );
  const rowRing = region(tone, "border", 0, rowY(1), TABLE_WIDTH, ROW_HEIGHT);
  const headRule = region(
    tone,
    "gap",
    0,
    HEADER_HEIGHT,
    TABLE_WIDTH,
    HEADER_RULE,
  );
  const rowRule = region(
    tone,
    "gap",
    0,
    rowY(1) + ROW_HEIGHT - ROW_RULE,
    TABLE_WIDTH,
    ROW_RULE,
  );
  const anatomy = bare(
    grid + cellPad.draw + headRule.draw + rowRule.draw + rowRing.draw,
  );

  const states = [
    { name: "Even row", token: "surface-raised" },
    { name: "Odd row", token: "surface-subtle" },
    { name: "Hovered", token: "+ surface-hover at 75%" },
    { name: "Selected", token: "+ fg-strong at 20%" },
    { name: "Selected, hovered", token: "both washes stack" },
    { name: "Row colour", token: "rowColorFn shows through" },
  ];

  const stateY = (index: number) => index * ROW_PITCH;
  const stateHeight = states.length * ROW_PITCH;
  const selectedRows = [3, 4];

  const wash = (index: number, fill: string, opacity: number) =>
    plate(0, stateY(index), STATE_WIDTH, ROW_HEIGHT, { fill, opacity });

  const stack =
    plate(0, 0, STATE_WIDTH, stateHeight, {
      fill: c("raised"),
      radius: CARD_CORNER,
    }) +
    [1, 2, 3, 4].map((index) => wash(index, c("subtle"), 1)).join("") +
    wash(5, c("info"), 1) +
    wash(3, c("strong"), SELECTED_WASH) +
    wash(4, c("strong"), SELECTED_WASH) +
    wash(2, c("hover"), HOVER_WASH) +
    wash(4, c("hover"), HOVER_WASH) +
    wash(5, c("hover"), HOVER_WASH) +
    selectedRows
      .map((index) =>
        plate(0, stateY(index), MARKER, ROW_HEIGHT, {
          fill: c("lineSelected"),
        }),
      )
      .join("") +
    states
      .map(
        (state, index) =>
          ink(
            MARKER + CELL_PAD_X,
            centre(stateY(index), ROW_HEIGHT, BODY),
            state.name,
            BODY,
            c("fg"),
          ) +
          (index === states.length - 1
            ? ""
            : rule(0, stateY(index) + ROW_HEIGHT - ROW_RULE, STATE_WIDTH)),
      )
      .join("");

  const markerRing = region(
    tone,
    "border",
    0,
    stateY(3),
    MARKER,
    ROW_HEIGHT,
  );
  const rows = bare(stack + markerRing.draw);
  const legend = states
    .map((state, index) =>
      code(
        tone,
        rows.columns.right,
        centre(stateY(index), ROW_HEIGHT, CAPTION),
        state.token,
      ),
    )
    .join("");

  const headText = CELL_PAD_X + textWidth("Method", BODY);
  const caretX = headText + HEADER_GAP;
  const endText = CELL_WIDTH - CELL_PAD_X;
  const endCaret = endText - textWidth("Status", BODY) - HEADER_GAP - CARET_BOX;
  const cellB = HEADER_HEIGHT + STEP;
  const caretY = round((HEADER_HEIGHT - CARET_BOX) / 2);

  const headerCell = (y: number, divider: boolean) =>
    plate(0, y, CELL_WIDTH, HEADER_HEIGHT, { fill: c("raised") }) +
    (divider
      ? plate(CELL_WIDTH - 1, y, 1, HEADER_HEIGHT, { fill: c("page") })
      : "");

  const headPadX = region(
    tone,
    "padding",
    0,
    HEADER_PAD_Y,
    CELL_PAD_X,
    HEADER_CONTENT,
  );
  const headPadY = region(
    tone,
    "padding",
    0,
    HEADER_HEIGHT - HEADER_PAD_Y,
    CELL_WIDTH,
    HEADER_PAD_Y,
  );
  const headGap = region(
    tone,
    "gap",
    endCaret + CARET_BOX,
    cellB + HEADER_PAD_Y,
    HEADER_GAP,
    HEADER_CONTENT,
  );
  const headGapFoot = {
    x: headGap.centre.x,
    y: round(cellB + HEADER_PAD_Y + HEADER_CONTENT),
  };
  const caretRing = region(tone, "border", caretX, caretY, CARET_BOX, CARET_BOX);
  const grabRing = region(
    tone,
    "border",
    CELL_WIDTH - RESIZER - GRAB_LEFT,
    0,
    GRAB,
    HEADER_HEIGHT,
  );
  const header = bare(
    headerCell(0, true) +
      ink(CELL_PAD_X, centre(0, HEADER_HEIGHT, BODY), "Method", BODY, c("fg")) +
      (await caret(caretX, caretY)) +
      headerCell(cellB, true) +
      ink(
        endText,
        centre(cellB, HEADER_HEIGHT, BODY),
        "Status",
        BODY,
        c("fg"),
        { anchor: "end" },
      ) +
      (await caret(endCaret, cellB + caretY)) +
      headPadX.draw +
      headPadY.draw +
      headGap.draw +
      caretRing.draw +
      grabRing.draw,
  );

  const cardHeight = CARD_ROWS * ROW_PITCH;
  const cardPlate = (x: number) =>
    plate(x, 0, CARD_WIDTH, cardHeight, {
      fill: c("raised"),
      radius: CARD_CORNER,
    });
  const cardRule = (x: number, index: number) =>
    rule(x, index * ROW_PITCH + ROW_HEIGHT - ROW_RULE, CARD_WIDTH);

  let loadingX = 0;
  const cardSlots: Slot[] = [
    {
      width: CARD_WIDTH,
      draw: (axis) => {
        loadingX = round(axis - CARD_WIDTH / 2);
        return (
          cardPlate(loadingX) +
          [...Array(CARD_ROWS).keys()]
            .map(
              (index) =>
                plate(
                  loadingX + SKELETON_PAD_X,
                  index * ROW_PITCH + (ROW_HEIGHT - SKELETON_HEIGHT) / 2,
                  CARD_WIDTH - SKELETON_PAD_X * 2,
                  SKELETON_HEIGHT,
                  { fill: c("subtle"), radius: RADIUS },
                ) + cardRule(loadingX, index),
            )
            .join("")
        );
      },
    },
    {
      width: CARD_WIDTH,
      draw: (axis) =>
        cardPlate(round(axis - CARD_WIDTH / 2)) +
        ink(axis, centre(0, cardHeight, BODY), "No findings", BODY, c("muted"), {
          anchor: "middle",
        }),
    },
    {
      width: CARD_WIDTH,
      draw: (axis) => {
        const x = round(axis - CARD_WIDTH / 2);
        return (
          cardPlate(x) +
          [...Array(CARD_ROWS).keys()]
            .map(
              (index) =>
                (index % 2 === 0
                  ? ""
                  : plate(x, index * ROW_PITCH, CARD_WIDTH, ROW_HEIGHT, {
                      fill: c("subtle"),
                    })) +
                ink(
                  x + CELL_PAD_X,
                  centre(index * ROW_PITCH, ROW_HEIGHT, BODY),
                  "GET /login",
                  BODY,
                  c("fg"),
                ) +
                cardRule(x, index),
            )
            .join("")
        );
      },
    },
  ];
  const cardRow = oneLineRow(cardSlots, 0, 0);
  const cardNames = ["loading", "empty", "data"]
    .map((name, index) =>
      code(
        tone,
        round(loadingX + CARD_WIDTH / 2 + index * (CARD_WIDTH + GAP)),
        cardHeight + LINE + CAPTION * 0.35,
        name,
        { anchor: "middle" },
      ),
    )
    .join("");
  const skeletonPad = region(
    tone,
    "padding",
    loadingX,
    0,
    SKELETON_PAD_X,
    ROW_HEIGHT,
  );
  const presentation = bare(cardRow + cardNames + skeletonPad.draw);

  const doLines = [
    '<div class="flex-1 min-h-0">',
    '  <CTable :items="items" />',
    "</div>",
  ];
  const dontLines = ['<CTable class="flex-1 min-h-0"', '  :items="items" />'];
  const codeLines = (lines: string[]) =>
    lines
      .map((line, index) => {
        const body = line.trimStart();
        return ink(
          textWidth(line.slice(0, line.length - body.length), CAPTION),
          LINE * (index + 1),
          escaped(body),
          CAPTION,
          c("fg"),
          { font: MONO },
        );
      })
      .join("");

  const faultToken = 'class="flex-1 min-h-0"';
  const dropped = markToken(
    tone,
    "fault",
    0,
    LINE,
    dontLines[0] ?? "",
    faultToken,
  );
  const sizingDo = bare(codeLines(doLines));
  const sizingDont = bare(codeLines(dontLines) + dropped.draw);

  return {
    "component-table-default":
      anatomy.draw +
      annotate(
        tone,
        anatomy.columns,
        "left",
        cellPad,
        cellPad.left.y,
        "px-4 pads each cell 16px",
      ) +
      annotate(
        tone,
        anatomy.columns,
        "left",
        rowRing,
        rowRing.left.y + LINE,
        "each row is itemHeight, 24px",
        "code",
        "key",
      ) +
      annotate(
        tone,
        anatomy.columns,
        "right",
        headRule,
        headRule.right.y,
        "border-b-4 closes the header",
      ) +
      annotate(
        tone,
        anatomy.columns,
        "right",
        rowRule,
        rowRule.right.y,
        "a 1px rule parts the rows",
      ) +
      note(
        tone,
        anatomy.axis,
        tableHeight + NOTE_STEP,
        "row parity counts from the list length",
      ),

    "component-table-rows":
      rows.draw +
      legend +
      annotate(
        tone,
        rows.columns,
        "left",
        markerRing,
        markerRing.left.y,
        "border-l-2 marks a selected row",
      ),

    "component-table-headercell":
      header.draw +
      annotate(
        tone,
        header.columns,
        "left",
        headPadX,
        headPadX.left.y,
        "px-4 pads 16px, py-2 pads 8px",
      ) +
      annotate(
        tone,
        header.columns,
        "left",
        headGapFoot,
        cellB + HEADER_HEIGHT + LINE,
        "gap-2 sets 8px before the caret",
      ) +
      annotate(
        tone,
        header.columns,
        "right",
        caretRing.centre,
        -LIFT,
        "the caret box is 1em, so 14px",
      ) +
      annotate(
        tone,
        header.columns,
        "right",
        grabRing,
        grabRing.right.y,
        "a 7px resizer grabs across 31px",
      ) +
      note(
        tone,
        header.axis,
        cellB + HEADER_HEIGHT + STEP + GRID * 2,
        'align="end" reverses the header row',
      ),

    "component-table-presentation":
      presentation.draw +
      annotate(
        tone,
        presentation.columns,
        "left",
        skeletonPad,
        skeletonPad.left.y,
        "skeleton rows pad px-2",
      ) +
      note(
        tone,
        presentation.axis,
        cardHeight + LINE + NOTE_STEP,
        "the loading rows fill the table's own height",
      ),

    "component-table-sizing-do":
      sizingDo.draw +
      note(
        tone,
        sizingDo.axis,
        LINE * doLines.length + NOTE_STEP,
        "the utilities land on the div, where they apply",
      ),

    "component-table-sizing-dont":
      sizingDont.draw +
      note(
        tone,
        sizingDont.axis,
        LINE * doLines.length + NOTE_STEP,
        "class is not forwarded, so it is dropped",
      ),
  };
};
