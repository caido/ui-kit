<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from "vue";

export type DsMenuItem = {
  id: string;
  label: string;

  icon?: string;

  shortcut?: string;
  role?: "menuitem" | "menuitemcheckbox" | "menuitemradio";
  checked?: boolean;
  disabled?: boolean;

  destructive?: boolean;

  submenu?: DsMenuItem[];
};

export type DsMenuGroup = {
  label?: string;
  items: DsMenuItem[];
};

const props = withDefaults(
  defineProps<{
    label: string;
    groups: DsMenuGroup[];
    density?: "compact" | "default" | "comfortable";

    surface?: "inline" | "button";
    triggerLabel?: string;
  }>(),
  { density: "default", surface: "inline", triggerLabel: "Actions" },
);

const emit = defineEmits<{ select: [item: DsMenuItem] }>();

const OPEN_DELAY = 150;
const CLOSE_GRACE = 300;
const TYPEAHEAD_RESET = 500;

const focusLayer =
  "bg-[color-mix(in_srgb,var(--c-fg-default)_10%,transparent)]";

const trigger =
  "inline-flex h-md items-center justify-center gap-2 rounded-md border border-control px-3 " +
  "bg-transparent text-body font-medium leading-none text-ink cursor-pointer " +
  "transition duration-1 ease-standard motion-reduce:transition-none hover:bg-inset " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]";

const panel =
  "box-border min-w-[176px] max-w-[320px] max-h-[min(60vh,calc(100vh_-_16px))] p-1 text-start " +
  "rounded-md border border-control bg-raised shadow-md";

const item =
  "relative flex items-center gap-2 rounded-xs text-body font-medium leading-none select-none " +
  "transition duration-1 ease-standard motion-reduce:transition-none " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:bg-[color-mix(in_srgb,var(--c-fg-default)_10%,transparent)]";

const enabledItem =
  "cursor-pointer hover:bg-[color-mix(in_srgb,var(--c-fg-default)_10%,transparent)] " +
  "active:bg-[color-mix(in_srgb,var(--c-fg-default)_14%,transparent)]";

const itemDensity = {
  compact: "min-h-xs px-2",
  default: "min-h-sm px-2",
  comfortable: "min-h-md px-3",
};

const groupLabelDensity = {
  compact: "px-2",
  default: "px-2",
  comfortable: "px-3",
};

const open = ref(props.surface === "inline");
const activeId = ref<string | undefined>(undefined);
const openSubId = ref<string | undefined>(undefined);
const subActiveId = ref<string | undefined>(undefined);

const checked = reactive<Record<string, boolean>>({});
const chosen = reactive<Record<string, string>>({});

const rootRef = ref<HTMLElement | undefined>(undefined);
const triggerRef = ref<HTMLButtonElement | undefined>(undefined);
const els = new Map<string, HTMLElement>();

let openTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let typeTimer: ReturnType<typeof setTimeout> | undefined;
let buffer = "";

const setEl = (id: string, el: unknown) => {
  if (el instanceof HTMLElement) els.set(id, el);
  else els.delete(id);
};

const rootItems = computed(() => props.groups.flatMap((group) => group.items));

const seedState = () => {
  for (const group of props.groups) {
    for (const entry of group.items) {
      if (entry.role === "menuitemcheckbox")
        checked[entry.id] = entry.checked === true;
      if (entry.role === "menuitemradio" && entry.checked === true) {
        chosen[group.label ?? "group"] = entry.id;
      }
      for (const child of entry.submenu ?? []) {
        if (child.role === "menuitemcheckbox")
          checked[child.id] = child.checked === true;
      }
    }
  }
  const first = rootItems.value[0];
  if (first !== undefined && activeId.value === undefined)
    activeId.value = first.id;
};
seedState();
watch(() => props.groups, seedState, { deep: true });

const groupKeyOf = (entry: DsMenuItem) => {
  const owner = props.groups.find((group) => group.items.includes(entry));
  return owner?.label ?? "group";
};

const isChecked = (entry: DsMenuItem) => {
  if (entry.role === "menuitemcheckbox") return checked[entry.id] === true;
  if (entry.role === "menuitemradio")
    return chosen[groupKeyOf(entry)] === entry.id;
  return false;
};

const groupHasSubmenu = (group: DsMenuGroup) =>
  group.items.some((entry) => (entry.submenu?.length ?? 0) > 0);

const groupNeedsRole = (group: DsMenuGroup) =>
  group.label !== undefined ||
  group.items.some((entry) => entry.role === "menuitemradio");

const toneOf = (entry: DsMenuItem) => {
  if (entry.disabled === true) return "cursor-not-allowed text-ink-faint";
  if (entry.destructive === true) return `${enabledItem} text-danger-ink`;
  return `${enabledItem} text-ink`;
};

const railToneOf = (entry: DsMenuItem) => {
  if (entry.disabled === true) return "text-ink-faint";
  if (entry.destructive === true) return "text-danger-ink";
  return "text-ink-muted";
};

const focusItem = (id: string) => {
  const el = els.get(id);

  el?.focus({ preventScroll: true });
};

const step = (
  list: DsMenuItem[],
  current: string | undefined,
  delta: number,
) => {
  if (list.length === 0) return undefined;
  const at = list.findIndex((entry) => entry.id === current);
  const next = at === -1 ? 0 : (at + delta + list.length) % list.length;
  return list[next]?.id;
};

const matchAhead = (
  list: DsMenuItem[],
  current: string | undefined,
  char: string,
) => {
  window.clearTimeout(typeTimer);
  buffer += char.toLowerCase();
  typeTimer = setTimeout(() => {
    buffer = "";
  }, TYPEAHEAD_RESET);

  const repeated =
    buffer.length > 1 && [...buffer].every((c) => c === buffer[0]);
  const needle = repeated ? (buffer[0] ?? "") : buffer;
  const from = list.findIndex((entry) => entry.id === current);
  const order = list.map((_, i) => list[(from + 1 + i) % list.length]);
  const hit = order.find((entry) =>
    entry?.label.toLowerCase().startsWith(needle),
  );
  return hit?.id;
};

const closeSub = () => {
  window.clearTimeout(openTimer);
  window.clearTimeout(closeTimer);
  openSubId.value = undefined;
  subActiveId.value = undefined;
};

const openSub = (entry: DsMenuItem, focusFirst: boolean) => {
  const first = entry.submenu?.[0];
  if (first === undefined) return;
  window.clearTimeout(closeTimer);
  openSubId.value = entry.id;
  subActiveId.value = first.id;
  if (focusFirst) void nextTick(() => focusItem(first.id));
};

const closeAll = (returnFocus: boolean) => {
  closeSub();
  if (props.surface === "button") {
    open.value = false;
    if (returnFocus) void nextTick(() => triggerRef.value?.focus());
  }
};

const activate = (entry: DsMenuItem, parent?: DsMenuItem) => {
  if (entry.disabled === true) return;

  if ((entry.submenu?.length ?? 0) > 0) {
    openSub(entry, true);
    return;
  }

  if (entry.role === "menuitemcheckbox") {
    checked[entry.id] = checked[entry.id] !== true;
    emit("select", entry);

    return;
  }

  if (entry.role === "menuitemradio") {
    chosen[groupKeyOf(parent ?? entry)] = entry.id;
  }

  emit("select", entry);
  closeAll(true);
};

const onRootKey = (event: KeyboardEvent) => {
  const list = rootItems.value;
  const current = list.find((entry) => entry.id === activeId.value);
  let next: string | undefined;

  switch (event.key) {
    case "ArrowDown":
      next = step(list, activeId.value, 1);
      break;
    case "ArrowUp":
      next = step(list, activeId.value, -1);
      break;
    case "Home":
      next = list[0]?.id;
      break;
    case "End":
      next = list[list.length - 1]?.id;
      break;
    case "ArrowRight":
      if (current !== undefined && (current.submenu?.length ?? 0) > 0) {
        event.preventDefault();
        openSub(current, true);
      }
      return;
    case "Enter":
    case " ":
      if (current !== undefined) {
        event.preventDefault();
        activate(current);
      }
      return;
    case "Escape":
      event.preventDefault();
      closeAll(true);
      return;
    case "Tab":
      closeAll(false);
      return;
    default:
      if (
        event.key.length === 1 &&
        event.altKey === false &&
        event.ctrlKey === false &&
        event.metaKey === false
      ) {
        next = matchAhead(list, activeId.value, event.key);
      }
  }

  if (next === undefined) return;
  event.preventDefault();
  closeSub();
  activeId.value = next;
  focusItem(next);
};

const onSubKey = (event: KeyboardEvent, parent: DsMenuItem) => {
  const list = parent.submenu ?? [];
  const current = list.find((entry) => entry.id === subActiveId.value);
  let next: string | undefined;

  switch (event.key) {
    case "ArrowDown":
      next = step(list, subActiveId.value, 1);
      break;
    case "ArrowUp":
      next = step(list, subActiveId.value, -1);
      break;
    case "Home":
      next = list[0]?.id;
      break;
    case "End":
      next = list[list.length - 1]?.id;
      break;
    case "ArrowLeft":
    case "Escape":
      event.preventDefault();
      event.stopPropagation();
      closeSub();
      focusItem(parent.id);
      return;
    case "Enter":
    case " ":
      if (current !== undefined) {
        event.preventDefault();
        event.stopPropagation();
        activate(current, parent);
        if (current.role !== "menuitemcheckbox") {
          closeSub();
          focusItem(parent.id);
        }
      }
      return;
    case "Tab":
      closeAll(false);
      return;
    default:
      if (
        event.key.length === 1 &&
        event.altKey === false &&
        event.ctrlKey === false &&
        event.metaKey === false
      ) {
        next = matchAhead(list, subActiveId.value, event.key);
      }
  }

  if (next === undefined) return;
  event.preventDefault();
  event.stopPropagation();
  subActiveId.value = next;
  focusItem(next);
};

const onItemEnter = (entry: DsMenuItem) => {
  activeId.value = entry.id;
  focusItem(entry.id);
  window.clearTimeout(openTimer);
  if ((entry.submenu?.length ?? 0) > 0) {
    openTimer = setTimeout(() => openSub(entry, false), OPEN_DELAY);
  } else if (openSubId.value !== undefined) {
    window.clearTimeout(closeTimer);
    closeTimer = setTimeout(closeSub, CLOSE_GRACE);
  }
};

const onSubItemEnter = (entry: DsMenuItem) => {
  window.clearTimeout(closeTimer);
  subActiveId.value = entry.id;
  focusItem(entry.id);
};

const onPanelLeave = () => {
  window.clearTimeout(openTimer);
  closeTimer = setTimeout(closeSub, CLOSE_GRACE);
};

const openFromTrigger = (landing: "first" | "last") => {
  const list = rootItems.value;
  const target = landing === "first" ? list[0] : list[list.length - 1];
  open.value = true;
  if (target === undefined) return;
  activeId.value = target.id;
  void nextTick(() => focusItem(target.id));
};

const onTriggerKey = (event: KeyboardEvent) => {
  if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openFromTrigger("first");
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    openFromTrigger("last");
  }
};

const onTriggerClick = () => {
  if (open.value) closeAll(false);
  else openFromTrigger("first");
};

const onOutside = (event: PointerEvent) => {
  const target = event.target;
  if (target instanceof Node && rootRef.value?.contains(target) === true)
    return;
  event.preventDefault();
  event.stopPropagation();
  closeAll(false);
};

watch(open, (isOpen) => {
  if (props.surface !== "button") return;
  if (isOpen) window.addEventListener("pointerdown", onOutside, true);
  else window.removeEventListener("pointerdown", onOutside, true);
});

onBeforeUnmount(() => {
  window.clearTimeout(openTimer);
  window.clearTimeout(closeTimer);
  window.clearTimeout(typeTimer);
  window.removeEventListener("pointerdown", onOutside, true);
});
</script>

<template>
  <div ref="rootRef" class="relative inline-block">
    <button
      v-if="surface === 'button'"
      ref="triggerRef"
      type="button"
      :class="trigger"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="onTriggerClick"
      @keydown="onTriggerKey"
    >
      {{ triggerLabel }}
      <i
        class="fas fa-caret-down text-caption text-ink-muted"
        aria-hidden="true"
      />
    </button>

    <div
      v-if="open"
      role="menu"
      :aria-label="label"
      :class="[
        panel,
        openSubId === undefined ? 'overflow-y-auto' : 'overflow-visible',
        surface === 'button' && 'absolute left-0 top-[calc(100%_+_4px)] z-20',
      ]"
      @keydown="onRootKey"
      @mouseleave="onPanelLeave"
    >
      <template v-for="(group, gi) in groups" :key="`g${gi}`">
        <div v-if="gi > 0" role="separator" class="my-1 h-px bg-separator" />
        <div
          v-if="group.label"
          aria-hidden="true"
          :class="[
            'flex min-h-sm items-center text-caption font-semibold text-ink-muted',
            groupLabelDensity[density],
          ]"
        >
          {{ group.label }}
        </div>

        <div
          :role="groupNeedsRole(group) ? 'group' : 'none'"
          :aria-label="group.label"
        >
          <div
            v-for="entry in group.items"
            :key="entry.id"
            :ref="(el) => setEl(entry.id, el)"
            :class="[
              item,
              itemDensity[density],
              toneOf(entry),
              openSubId === entry.id && focusLayer,
            ]"
            :role="entry.role ?? 'menuitem'"
            :tabindex="activeId === entry.id ? 0 : -1"
            :aria-disabled="entry.disabled === true ? 'true' : undefined"
            :aria-checked="
              entry.role === 'menuitemcheckbox' ||
              entry.role === 'menuitemradio'
                ? isChecked(entry)
                : undefined
            "
            :aria-haspopup="
              (entry.submenu?.length ?? 0) > 0 ? 'menu' : undefined
            "
            :aria-expanded="
              (entry.submenu?.length ?? 0) > 0
                ? openSubId === entry.id
                : undefined
            "
            @mouseenter="onItemEnter(entry)"
            @click="activate(entry)"
            @focus="activeId = entry.id"
          >
            <span
              aria-hidden="true"
              :class="[
                'flex h-[16px] w-[16px] flex-none items-center justify-center text-code leading-none',
                railToneOf(entry),
              ]"
            >
              <i v-if="isChecked(entry)" class="fas fa-check text-ink" />
              <i v-else-if="entry.icon" :class="entry.icon" />
            </span>
            <span
              class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
              >{{ entry.label }}</span
            >
            <span
              v-if="entry.shortcut"
              aria-hidden="true"
              :class="[
                'ml-[20px] flex-none text-caption font-normal tabular-nums',
                entry.disabled === true ? 'text-ink-faint' : 'text-ink-muted',
              ]"
            >
              {{ entry.shortcut }}
            </span>
            <span
              v-if="groupHasSubmenu(group)"
              aria-hidden="true"
              class="flex w-[16px] flex-none items-center justify-center text-code text-ink-muted"
            >
              <i
                v-if="(entry.submenu?.length ?? 0) > 0"
                class="fas fa-caret-right"
              />
            </span>

            <div
              v-if="openSubId === entry.id"
              role="menu"
              :aria-label="entry.label"
              :class="[panel, 'absolute -top-1 left-[calc(100%_-_4px)] z-30']"
              @keydown="onSubKey($event, entry)"
              @click.stop
            >
              <div
                v-for="child in entry.submenu"
                :key="child.id"
                :ref="(el) => setEl(child.id, el)"
                :class="[item, itemDensity[density], toneOf(child)]"
                :role="child.role ?? 'menuitem'"
                :tabindex="subActiveId === child.id ? 0 : -1"
                :aria-disabled="child.disabled === true ? 'true' : undefined"
                :aria-checked="
                  child.role === 'menuitemcheckbox' ||
                  child.role === 'menuitemradio'
                    ? checked[child.id] === true
                    : undefined
                "
                @mouseenter="onSubItemEnter(child)"
                @click="activate(child, entry)"
                @focus="subActiveId = child.id"
              >
                <span
                  aria-hidden="true"
                  :class="[
                    'flex h-[16px] w-[16px] flex-none items-center justify-center text-code leading-none',
                    railToneOf(child),
                  ]"
                >
                  <i
                    v-if="
                      child.role === 'menuitemcheckbox' &&
                      checked[child.id] === true
                    "
                    class="fas fa-check text-ink"
                  />
                  <i v-else-if="child.icon" :class="child.icon" />
                </span>
                <span
                  class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                  >{{ child.label }}</span
                >
                <span
                  v-if="child.shortcut"
                  aria-hidden="true"
                  :class="[
                    'ml-[20px] flex-none text-caption font-normal tabular-nums',
                    child.disabled === true
                      ? 'text-ink-faint'
                      : 'text-ink-muted',
                  ]"
                >
                  {{ child.shortcut }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
