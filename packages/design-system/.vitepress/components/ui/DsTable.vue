<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from "vue";

type Density = "compact" | "default" | "comfortable";
type SortDirection = "ascending" | "descending";
type Status = "ready" | "loading" | "refreshing" | "empty" | "error";

type DsTableColumn = {
  key: string;
  label: string;

  width?: string;

  numeric?: boolean;

  mono?: boolean;
  sortable?: boolean;

  fixed?: boolean;

  rowHeader?: boolean;
};

type DsTableRow = {
  id: string;
  cells: Record<string, string>;

  tag?: boolean;

  nonActionable?: boolean;
};

const SAMPLE_COLUMNS: DsTableColumn[] = [
  { key: "method", label: "Method", width: "84px", sortable: true },
  { key: "host", label: "Host", sortable: true },
  { key: "path", label: "Path", sortable: true, rowHeader: true },
  {
    key: "status",
    label: "Status",
    width: "76px",
    numeric: true,
    sortable: true,
  },
  {
    key: "size",
    label: "Size (B)",
    width: "92px",
    numeric: true,
    sortable: true,
  },
  {
    key: "time",
    label: "Time",
    width: "108px",
    mono: true,
    sortable: true,
    fixed: true,
  },
];

const BRIEF_COLUMNS: DsTableColumn[] = [
  { key: "path", label: "Path", sortable: true, rowHeader: true },
  {
    key: "status",
    label: "Status",
    width: "76px",
    numeric: true,
    sortable: true,
  },
  {
    key: "time",
    label: "Time",
    width: "104px",
    mono: true,
    sortable: true,
    fixed: true,
  },
];

const SAMPLE_ROWS: DsTableRow[] = [
  {
    id: "r1",
    cells: {
      method: "GET",
      host: "example.com",
      path: "/login",
      status: "200",
      size: "1204",
      time: "12:04:01.221",
    },
  },
  {
    id: "r2",
    cells: {
      method: "POST",
      host: "example.com",
      path: "/api/token",
      status: "401",
      size: "318",
      time: "12:04:03.007",
    },
  },
  {
    id: "r3",
    cells: {
      method: "GET",
      host: "cdn.example.com",
      path: "/app.js",
      status: "200",
      size: "84210",
      time: "12:04:03.984",
    },
  },
  {
    id: "r4",
    cells: {
      method: "PUT",
      host: "api.example.com",
      path: "/v2/session",
      status: "204",
      size: "0",
      time: "12:04:07.512",
    },
  },
  {
    id: "r5",
    cells: {
      method: "GET",
      host: "static.example.com",
      path: "/img/logo.svg",
      status: "304",
      size: "",
      time: "12:04:09.140",
    },
  },
];

const STATE_ROWS: DsTableRow[] = SAMPLE_ROWS.map((row, i) =>
  i === 2
    ? { ...row, tag: true }
    : i === 4
      ? { ...row, nonActionable: true }
      : row,
);

const {
  columns,
  rows,
  preset = "history",
  density = "default",
  zebra = true,
  separation = "rule",
  selection = "multiple",
  status = "ready",
  sortKey = "",
  sortDirection = "ascending",
  label = "Proxy history",
  emptyTitle = "No requests match this filter",
  emptyBody = "12,480 requests are in the set. The current filter excludes all of them.",
  emptyAction = "Clear filter",
  totalRows = 0,
  showStates = false,
  selectedIndex = 1,
} = defineProps<{
  columns?: DsTableColumn[];
  rows?: DsTableRow[];

  preset?: "history" | "brief";
  density?: Density;

  zebra?: boolean;

  separation?: "rule" | "none";
  selection?: "none" | "single" | "multiple";
  status?: Status;
  sortKey?: string;
  sortDirection?: SortDirection;

  label?: string;
  emptyTitle?: string;
  emptyBody?: string;
  emptyAction?: string;

  totalRows?: number;

  showStates?: boolean;

  selectedIndex?: number;
}>();

const emit = defineEmits<{
  sort: [payload: { key: string; direction: SortDirection }];
  activate: [id: string];
  recover: [];
  "update:selected": [ids: string[]];
}>();

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] focus-visible:z-10";

const ROW_HEIGHT: Record<Density, number> = {
  compact: 24,
  default: 28,
  comfortable: 32,
};
const ROW_HEIGHT_CLASS: Record<Density, string> = {
  compact: "h-xs",
  default: "h-sm",
  comfortable: "h-md",
};
const CELL_PAD_CLASS: Record<Density, string> = {
  compact: "px-2",
  default: "px-3",
  comfortable: "px-4",
};
const MIN_COLUMN_WIDTH = 64;

const rowHeight = computed(() => ROW_HEIGHT[density]);
const rowHeightClass = computed(() => ROW_HEIGHT_CLASS[density]);
const cellPadClass = computed(() => CELL_PAD_CLASS[density]);

const cols = computed(
  () => columns ?? (preset === "brief" ? BRIEF_COLUMNS : SAMPLE_COLUMNS),
);
const data = computed(() => rows ?? (showStates ? STATE_ROWS : SAMPLE_ROWS));

const widths = ref<Record<string, string>>({});

const trackOf = (column: DsTableColumn) => {
  const dragged = widths.value[column.key];
  if (dragged !== undefined) return dragged;
  if (column.width !== undefined) return column.width;
  return column.numeric === true ? "minmax(64px, 0.4fr)" : "minmax(88px, 1fr)";
};

const gridStyle = computed(() => ({
  "--dst-cols": cols.value.map((column) => trackOf(column)).join(" "),
}));

const activeSortKey = ref(sortKey);
const activeSortDirection = ref<SortDirection>(sortDirection);

const initialSelection = () => {
  if (selection === "none" || selectedIndex < 0) return [];
  const row = (rows ?? (showStates ? STATE_ROWS : SAMPLE_ROWS))[selectedIndex];
  return row === undefined ? [] : [row.id];
};
const selectedIds = ref<string[]>(initialSelection());
const anchorId = ref("");

const isBodyVisible = computed(
  () => status === "ready" || status === "refreshing",
);

const setSize = computed(() =>
  isBodyVisible.value ? (totalRows > 0 ? totalRows : data.value.length) : 0,
);

const isSelected = (id: string) => selectedIds.value.includes(id);

const isRowEven = (index: number) =>
  data.value.length % 2 === 0 ? index % 2 === 0 : index % 2 !== 0;

const selectable = computed(() =>
  data.value.filter((row) => row.nonActionable !== true),
);

const commit = () => emit("update:selected", selectedIds.value);

const selectOnly = (row: DsTableRow) => {
  selectedIds.value = [row.id];
  anchorId.value = row.id;
  commit();
};

const toggleRow = (row: DsTableRow) => {
  if (isSelected(row.id)) {
    if (selectedIds.value.length === 1) return;
    selectedIds.value = selectedIds.value.filter((id) => id !== row.id);
  } else {
    selectedIds.value = [...selectedIds.value, row.id];
    anchorId.value = row.id;
  }
  commit();
};

const extendTo = (index: number) => {
  const anchorIndex = data.value.findIndex((row) => row.id === anchorId.value);
  const to = Math.min(Math.max(index, 0), data.value.length - 1);
  if (anchorIndex === -1) {
    const row = data.value[to];
    if (row !== undefined) selectOnly(row);
    return;
  }
  selectedIds.value = data.value
    .slice(Math.min(anchorIndex, to), Math.max(anchorIndex, to) + 1)
    .filter((row) => row.nonActionable !== true)
    .map((row) => row.id);
  commit();
};

const selectAll = () => {
  selectedIds.value = selectable.value.map((row) => row.id);
  commit();
};

const onRowPointerDown = (
  row: DsTableRow,
  index: number,
  event: MouseEvent,
) => {
  if (selection === "none" || row.nonActionable === true) return;
  if (event.button === 2 && isSelected(row.id)) return;
  if (selection === "single") {
    selectOnly(row);
    return;
  }
  if (event.metaKey || event.ctrlKey) {
    toggleRow(row);
    return;
  }
  if (event.shiftKey) {
    extendTo(index);
    return;
  }
  selectOnly(row);
};

const sortBy = (column: DsTableColumn) => {
  if (column.sortable !== true) return;
  const nextDirection: SortDirection =
    activeSortKey.value === column.key &&
    activeSortDirection.value === "ascending"
      ? "descending"
      : "ascending";
  activeSortKey.value = column.key;
  activeSortDirection.value = nextDirection;
  emit("sort", { key: column.key, direction: nextDirection });
};

const sortOf = (column: DsTableColumn) =>
  activeSortKey.value === column.key ? activeSortDirection.value : undefined;

const gridRef = useTemplateRef<HTMLElement>("grid");
const viewportRef = useTemplateRef<HTMLElement>("viewport");
const cursorRow = ref(0);
const cursorCol = ref(0);

const lastCol = computed(() => cols.value.length - 1);
const lastRow = computed(() => (isBodyVisible.value ? data.value.length : 0));

const tabOf = (r: number, c: number) =>
  cursorRow.value === r && cursorCol.value === c ? 0 : -1;

const focusCursor = async () => {
  await nextTick();
  gridRef.value
    ?.querySelector<HTMLElement>(
      `[data-r="${cursorRow.value}"][data-c="${cursorCol.value}"]`,
    )
    ?.focus();
};

const moveTo = (r: number, c: number) => {
  cursorRow.value = Math.min(Math.max(r, 0), lastRow.value);
  cursorCol.value = Math.min(Math.max(c, 0), lastCol.value);
  void focusCursor();
};

const trackCursor = (event: FocusEvent) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const r = target.dataset.r;
  const c = target.dataset.c;
  if (r === undefined || c === undefined) return;
  cursorRow.value = Number(r);
  cursorCol.value = Number(c);
};

const pageStep = () => {
  const height = viewportRef.value?.clientHeight ?? rowHeight.value;
  return Math.max(1, Math.floor(height / rowHeight.value) - 1);
};

const moveRow = (target: number, event: KeyboardEvent) => {
  moveTo(target, cursorCol.value);
  if (selection === "none") return;
  const row = data.value[cursorRow.value - 1];
  if (row === undefined || row.nonActionable === true) return;
  if (event.shiftKey && selection === "multiple") {
    extendTo(cursorRow.value - 1);
    return;
  }
  selectOnly(row);
};

const onKeydown = (event: KeyboardEvent) => {
  const r = cursorRow.value;
  const c = cursorCol.value;
  const row = r > 0 ? data.value[r - 1] : undefined;
  const mod = event.ctrlKey || event.metaKey;

  switch (event.key) {
    case "ArrowRight":
      moveTo(r, c + 1);
      break;
    case "ArrowLeft":
      moveTo(r, c - 1);
      break;
    case "ArrowDown":
      moveRow(r + 1, event);
      break;
    case "ArrowUp":
      moveRow(r - 1, event);
      break;
    case "PageDown":
      moveRow(mod ? lastRow.value : r + pageStep(), event);
      break;
    case "PageUp":
      moveRow(mod ? 1 : r - pageStep(), event);
      break;
    case "Home":
      moveTo(mod ? 0 : r, 0);
      break;
    case "End":
      moveTo(mod ? lastRow.value : r, lastCol.value);
      break;
    case " ":
      if (
        row === undefined ||
        row.nonActionable === true ||
        selection === "none"
      )
        return;
      if (event.shiftKey || selection === "single") selectOnly(row);
      else toggleRow(row);
      break;
    case "a":
    case "A":
      if (!mod || selection !== "multiple") return;
      selectAll();
      break;
    case "Enter":
      if (row === undefined || row.nonActionable === true) return;
      emit("activate", row.id);
      break;
    default:
      return;
  }
  event.preventDefault();
};

const startResize = (column: DsTableColumn, event: PointerEvent) => {
  const handle = event.currentTarget;
  if (!(handle instanceof HTMLElement)) return;
  const cell = handle.parentElement;
  if (cell === null) return;
  const startX = event.clientX;
  const startWidth = cell.getBoundingClientRect().width;
  handle.setPointerCapture(event.pointerId);

  const onMove = (move: PointerEvent) => {
    widths.value = {
      ...widths.value,
      [column.key]: `${Math.max(MIN_COLUMN_WIDTH, Math.round(startWidth + move.clientX - startX))}px`,
    };
  };
  const onEnd = () => {
    handle.removeEventListener("pointermove", onMove);
    handle.removeEventListener("pointerup", onEnd);
    handle.removeEventListener("pointercancel", onEnd);
  };
  handle.addEventListener("pointermove", onMove);
  handle.addEventListener("pointerup", onEnd);
  handle.addEventListener("pointercancel", onEnd);
  event.preventDefault();
};

const valueOf = (row: DsTableRow, column: DsTableColumn) =>
  row.cells[column.key] ?? "";

const SKELETON_ROWS = [0, 1, 2, 3, 4, 5];

const SKELETON_WIDTHS = [
  "w-[62%]",
  "w-[84%]",
  "w-[71%]",
  "w-[48%]",
  "w-[78%]",
  "w-[55%]",
  "w-[88%]",
  "w-[66%]",
];
const SKELETON_BAR =
  "h-2 rounded-md bg-skeleton animate-pulse motion-reduce:animate-none";
</script>

<template>
  <div
    class="flex w-full min-w-0 flex-col overflow-hidden rounded-sm bg-raised text-ink shadow-md"
    :style="gridStyle"
  >
    <div ref="viewport" class="min-w-0 max-h-[340px] overflow-auto">
      <div
        ref="grid"
        class="w-full"
        role="grid"
        :aria-label="label"
        :aria-rowcount="setSize + 1"
        :aria-colcount="cols.length"
        :aria-multiselectable="selection === 'multiple' ? true : undefined"
        :aria-busy="
          status === 'loading' || status === 'refreshing' ? true : undefined
        "
        @keydown="onKeydown"
        @focusin="trackCursor"
      >
        <div
          class="sticky top-0 z-20 box-border grid grid-cols-[var(--dst-cols)] border-b-[0.2em] border-line bg-header"
          :class="rowHeightClass"
          role="row"
          :aria-rowindex="1"
        >
          <div
            v-for="(column, ci) in cols"
            :key="column.key"
            class="relative flex min-w-0 select-none items-center text-dense font-semibold text-ink"
            :class="[column.fixed === true ? '' : 'border-e border-line']"
            role="columnheader"
            :aria-colindex="ci + 1"
            :aria-sort="sortOf(column)"
          >
            <component
              :is="column.sortable === true ? 'button' : 'div'"
              :type="column.sortable === true ? 'button' : undefined"
              class="flex h-full w-full min-w-0 items-center gap-2 border-0 bg-transparent text-dense font-semibold text-inherit"
              :class="[
                cellPadClass,
                FOCUS_RING,
                column.sortable === true && 'cursor-pointer active:bg-pressed',
                column.numeric === true && 'flex-row-reverse',
              ]"
              :data-r="0"
              :data-c="ci"
              :tabindex="tabOf(0, ci)"
              @click="sortBy(column)"
            >
              <span class="truncate">{{ column.label }}</span>
              <i
                v-if="sortOf(column) !== undefined"
                :class="
                  sortOf(column) === 'descending'
                    ? 'fas fa-caret-down'
                    : 'fas fa-caret-up'
                "
                class="w-[1em] shrink-0 text-center text-[12px] leading-none"
                aria-hidden="true"
              />
            </component>

            <span
              v-if="column.fixed !== true"
              class="absolute inset-y-0 -end-1 z-10 w-2 cursor-col-resize touch-none"
              aria-hidden="true"
              @pointerdown="startResize(column, $event)"
            />
          </div>

          <span
            v-if="status === 'refreshing'"
            class="pointer-events-none absolute -bottom-0.5 start-0 h-0.5 w-1/3 animate-sweep bg-accent motion-reduce:w-full motion-reduce:animate-none"
            aria-hidden="true"
          />
        </div>

        <template v-if="isBodyVisible">
          <div
            v-for="(row, ri) in data"
            :key="row.id"
            class="relative box-border grid grid-cols-[var(--dst-cols)] focus-within:z-10"
            :class="[
              rowHeightClass,
              separation === 'rule' && 'border-b-[0.1em] border-line',
              zebra && !isRowEven(ri) && 'bg-row-zebra',
              row.nonActionable === true
                ? 'cursor-default text-ink-muted'
                : 'cursor-pointer hover:bg-row-hover',
            ]"
            role="row"
            :aria-rowindex="ri + 2"
            :aria-selected="
              selection === 'none' ? undefined : isSelected(row.id)
            "
            :aria-disabled="row.nonActionable === true ? true : undefined"
            @mousedown="onRowPointerDown(row, ri, $event)"
          >
            <span
              v-if="row.tag === true"
              class="pointer-events-none absolute inset-0 bg-tag-row"
              aria-hidden="true"
            />

            <div
              v-for="(column, ci) in cols"
              :key="column.key"
              class="relative flex min-w-0 items-center"
              :class="[
                cellPadClass,
                FOCUS_RING,
                row.tag === true && 'text-tag-ink',
                column.numeric === true && 'justify-end tabular-nums',
                column.mono === true
                  ? 'font-mono text-caption tabular-nums'
                  : 'text-dense',
              ]"
              :role="column.rowHeader === true ? 'rowheader' : 'gridcell'"
              :aria-colindex="ci + 1"
              :title="valueOf(row, column)"
              :data-r="ri + 1"
              :data-c="ci"
              :tabindex="tabOf(ri + 1, ci)"
            >
              <span v-if="valueOf(row, column).length > 0" class="truncate">{{
                valueOf(row, column)
              }}</span>
              <span v-else class="text-ink-faint">-</span>
            </div>

            <span
              v-if="isSelected(row.id)"
              class="pointer-events-none absolute inset-0 z-[1] border-s-[2.8px] border-gold-ink bg-row-selected"
              aria-hidden="true"
            />
          </div>
        </template>

        <template v-else-if="status === 'loading'">
          <div
            v-for="ski in SKELETON_ROWS"
            :key="ski"
            class="box-border grid grid-cols-[var(--dst-cols)]"
            :class="[
              rowHeightClass,
              separation === 'rule' && 'border-b-[0.1em] border-line',
            ]"
            role="row"
            :aria-rowindex="ski + 2"
          >
            <div
              v-for="(column, ci) in cols"
              :key="column.key"
              class="flex min-w-0 items-center"
              :class="cellPadClass"
              role="gridcell"
              :aria-colindex="ci + 1"
            >
              <span
                :class="[
                  SKELETON_BAR,
                  SKELETON_WIDTHS[(ski + ci) % SKELETON_WIDTHS.length],
                ]"
              />
            </div>
          </div>
        </template>
      </div>

      <div
        v-if="status === 'empty'"
        class="flex min-h-[160px] flex-col items-center justify-center gap-2 px-16 py-8 text-center"
        role="status"
      >
        <i
          class="fas fa-inbox text-[24px] leading-none text-ink-faint"
          aria-hidden="true"
        />
        <p class="m-0 text-title font-semibold text-ink">{{ emptyTitle }}</p>
        <p class="m-0 mb-2 max-w-[46ch] text-body text-ink-muted">
          {{ emptyBody }}
        </p>
        <button
          type="button"
          class="inline-flex h-md cursor-pointer items-center rounded-md border border-control bg-transparent px-3 text-body font-medium text-ink transition duration-1 ease-standard hover:bg-inset motion-reduce:transition-none"
          :class="FOCUS_RING"
          @click="emit('recover')"
        >
          {{ emptyAction }}
        </button>
      </div>

      <div
        v-else-if="status === 'error'"
        class="flex min-h-[160px] flex-col items-center justify-center gap-2 px-16 py-8 text-center"
        role="alert"
      >
        <i
          class="fas fa-triangle-exclamation text-[24px] leading-none text-danger-ink"
          aria-hidden="true"
        />
        <p class="m-0 text-title font-semibold text-danger-ink">
          The request set could not be loaded
        </p>
        <p class="m-0 mb-2 max-w-[46ch] text-body text-ink-muted">
          The project database rejected the query. Nothing was lost.
        </p>
        <button
          type="button"
          class="inline-flex h-md cursor-pointer items-center rounded-md border border-control bg-transparent px-3 text-body font-medium text-ink transition duration-1 ease-standard hover:bg-inset motion-reduce:transition-none"
          :class="FOCUS_RING"
          @click="emit('recover')"
        >
          Retry
        </button>
      </div>
    </div>

    <div
      class="flex h-sm items-center justify-between gap-3 border-t-2 border-line text-dense text-ink tabular-nums"
      :class="cellPadClass"
    >
      <span>{{ selectedIds.length }} selected of {{ setSize }}</span>
      <span>{{ density }} · {{ rowHeight }}px rows</span>
    </div>
  </div>
</template>
