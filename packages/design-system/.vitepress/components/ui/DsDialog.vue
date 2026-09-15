<script setup lang="ts">
import { computed, nextTick, ref, useId } from "vue";

type Variant = "standard" | "confirm" | "destructive";
type Size = "sm" | "md" | "lg" | "full";

const props = withDefaults(
  defineProps<{
    title?: string;
    message?: string;
    variant?: Variant;
    size?: Size;
    triggerLabel?: string;
    confirmLabel?: string;
    cancelLabel?: string;

    fieldLabel?: string;

    checkboxLabel?: string;

    long?: boolean;

    loading?: boolean;

    error?: string;

    dirty?: boolean;
  }>(),
  {
    title: "Dialog title",
    variant: "standard",
    size: "md",
    triggerLabel: "Open dialog",
    confirmLabel: "Save",
    cancelLabel: "Cancel",
    long: false,
    loading: false,
    dirty: false,
  },
);

const uid = useId();
const titleId = `${uid}-title`;
const descId = `${uid}-desc`;

const dialogEl = ref<HTMLDialogElement>();
const triggerEl = ref<HTMLButtonElement>();
const titleEl = ref<HTMLElement>();
const bodyEl = ref<HTMLElement>();
const fieldEl = ref<HTMLInputElement>();
const errorEl = ref<HTMLElement>();
const cancelEl = ref<HTMLButtonElement>();
const confirmEl = ref<HTMLButtonElement>();

const mounted = ref(false);
const shown = ref(false);
const scrolled = ref(false);
const moreBelow = ref(false);

const isAlert = computed(() => props.variant !== "standard");
const hasClose = computed(() => props.variant !== "destructive");
const statusIcon = computed(() =>
  props.variant === "destructive"
    ? "fas fa-triangle-exclamation"
    : "fas fa-circle-question",
);

const focusables = () => {
  const root = dialogEl.value;
  if (root === undefined) return [];
  const found = root.querySelectorAll<HTMLElement>(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
  );
  return Array.from(found).filter((el) => el.getClientRects().length > 0);
};

const initialFocus = () => {
  const target =
    props.error !== undefined
      ? errorEl.value
      : props.variant === "destructive"
        ? cancelEl.value
        : props.long
          ? titleEl.value
          : props.fieldLabel !== undefined
            ? fieldEl.value
            : confirmEl.value;
  target?.focus();
};

const syncScroll = () => {
  const el = bodyEl.value;
  if (el === undefined) return;
  scrolled.value = el.scrollTop > 0;
  moreBelow.value = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
};

const open = () => {
  dialogEl.value?.showModal();
  mounted.value = true;
  nextTick(() => {
    shown.value = true;
    syncScroll();
    initialFocus();
  });
};

const dismiss = () => {
  dialogEl.value?.close("cancel");
};

const commit = () => {
  if (props.loading) return;
  dialogEl.value?.close("confirm");
};

const onScrimClick = (event: MouseEvent) => {
  if (event.target !== dialogEl.value) return;
  if (props.dirty) return;
  dismiss();
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Tab") {
    const items = focusables();
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === dialogEl.value)) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    }
    return;
  }

  if (event.key !== "Enter") return;
  const target = event.target instanceof HTMLElement ? event.target : undefined;
  const tag = target?.tagName;
  if (tag === "BUTTON" || tag === "A" || tag === "TEXTAREA") return;
  if (target?.isContentEditable === true) return;
  event.preventDefault();
  if (props.variant === "destructive") return;
  commit();
};

const onClose = () => {
  mounted.value = false;
  shown.value = false;
  triggerEl.value?.focus();
};

const ring =
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)] " +
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]";

const btn =
  "inline-flex h-md cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md " +
  "border border-solid px-3 text-body font-medium leading-none transition duration-1 " +
  "ease-standard motion-reduce:transition-none " +
  ring;

const secondary = "border-control bg-transparent text-ink hover:bg-inset";
const primary = "border-accent bg-accent text-ink-onsolid hover:brightness-110";

const danger =
  "border-danger-ink bg-danger-ink text-canvas hover:brightness-110";

const scrim = "bg-black/40";

const shellWidths = {
  sm: "max-w-[400px] max-h-[min(90dvh,720px)] rounded-lg border border-solid border-control",
  md: "max-w-[480px] max-h-[min(90dvh,720px)] rounded-lg border border-solid border-control",
  lg: "max-w-[640px] max-h-[min(90dvh,720px)] rounded-lg border border-solid border-control",
  full: "max-w-none h-[100dvh] max-h-[100dvh] rounded-none",
};

const text = "!m-0 max-w-[60ch] !leading-5";

const affected = Array.from(
  { length: 18 },
  (_, i) => `api-${String(i + 1).padStart(2, "0")}.staging.internal`,
);
</script>

<template>
  <button
    ref="triggerEl"
    type="button"
    aria-haspopup="dialog"
    :class="[btn, secondary]"
    @click="open"
  >
    {{ triggerLabel }}
  </button>

  <dialog
    ref="dialogEl"
    :role="isAlert ? 'alertdialog' : 'dialog'"
    aria-modal="true"
    :aria-labelledby="titleId"
    :aria-describedby="message !== undefined ? descId : undefined"
    :closedby="dirty ? 'closerequest' : 'any'"
    class="fixed inset-0 m-0 h-[100dvh] max-h-[100dvh] w-screen max-w-[100vw] items-center justify-center border-0 bg-transparent text-ink"
    :class="[mounted ? 'flex' : 'hidden', size === 'full' ? 'p-0' : 'p-5']"
    @click="onScrimClick"
    @keydown="onKeydown"
    @close="onClose"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 transition-opacity duration-4 ease-standard motion-reduce:duration-2"
      :class="[scrim, shown ? 'opacity-100' : 'opacity-0']"
    />

    <div
      class="relative flex w-full min-w-[min(288px,100%)] flex-col overflow-hidden bg-raised shadow-lg transition duration-4 ease-standard motion-reduce:duration-2"
      :class="[
        shellWidths[size],
        shown
          ? 'opacity-100 motion-safe:translate-y-0'
          : 'opacity-0 motion-safe:translate-y-4',
      ]"
    >
      <header
        class="flex min-h-[56px] flex-none items-center gap-2 p-4 transition-shadow duration-2 ease-standard motion-reduce:transition-none"
        :class="
          scrolled
            ? 'shadow-[inset_0_-1px_0_var(--c-border-separator)]'
            : 'shadow-none'
        "
      >
        <i
          v-if="isAlert"
          aria-hidden="true"
          class="inline-flex h-xs w-xs flex-none items-center justify-center text-[18px] leading-none"
          :class="[
            statusIcon,
            variant === 'destructive' ? 'text-danger-ink' : 'text-gold-ink',
          ]"
        />
        <h2
          :id="titleId"
          ref="titleEl"
          tabindex="-1"
          class="flex-1 rounded-xs !border-0 !p-0 !m-0 !text-title !leading-6 !tracking-normal font-semibold text-ink"
          :class="ring"
        >
          {{ title }}
        </h2>
        <button
          v-if="hasClose"
          type="button"
          aria-label="Close"
          :aria-disabled="loading || undefined"
          class="-my-[2px] inline-flex h-sm w-sm flex-none cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-code leading-none text-ink-muted transition duration-1 ease-standard hover:bg-inset hover:text-ink motion-reduce:transition-none aria-disabled:cursor-not-allowed aria-disabled:text-ink-faint"
          :class="ring"
          @click="loading ? undefined : dismiss()"
        >
          <i class="fas fa-xmark" aria-hidden="true" />
        </button>
      </header>

      <div
        ref="bodyEl"
        class="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4 text-body"
        @scroll="syncScroll"
      >
        <p
          v-if="error !== undefined"
          ref="errorEl"
          role="alert"
          tabindex="-1"
          class="rounded-none border border-solid border-danger-ink px-3 py-2 text-danger-ink"
          :class="[text, ring]"
        >
          {{ error }}
        </p>

        <p
          v-if="message !== undefined"
          :id="descId"
          :class="text"
          class="text-ink"
        >
          {{ message }}
        </p>

        <p v-if="long" :class="text" class="text-ink-muted">
          Every request in the selected range is rewritten with the new host,
          the new scheme and the new port. Requests that already carry an
          absolute URL in the request line are left as they are, because
          rewriting those changes the meaning of the request.
        </p>
        <p v-if="long" :class="text" class="text-ink-muted">
          Matching findings keep their references. If a finding points at a
          request that no longer exists after the rewrite, the reference is
          marked stale rather than removed, so the report still records what was
          tested.
        </p>
        <p v-if="long" :class="text" class="text-ink-muted">
          The operation runs on the project database and cannot be paused once
          it starts. A project of this size takes around forty seconds.
        </p>
        <ul v-if="long" class="!m-0 !mt-1 !list-none !p-0">
          <li
            v-for="host in affected"
            :key="host"
            class="!m-0 border-0 border-t border-solid border-separator py-1 text-code !leading-5 text-ink-muted"
          >
            {{ host }}
          </li>
        </ul>

        <label v-if="fieldLabel !== undefined" class="mt-1 flex flex-col gap-1">
          <span class="text-code font-medium text-ink-muted">{{
            fieldLabel
          }}</span>
          <input
            ref="fieldEl"
            type="text"
            :readonly="loading"
            class="h-md rounded-none border border-solid border-control bg-inset px-2 text-body text-ink read-only:text-ink-muted"
            :class="ring"
          />
        </label>

        <label
          v-if="checkboxLabel !== undefined"
          class="mt-1 flex items-center gap-2"
        >
          <input
            type="checkbox"
            class="m-0 h-4 w-4 accent-[var(--c-accent-solid)]"
            :class="ring"
          />
          <span>{{ checkboxLabel }}</span>
        </label>
      </div>

      <footer
        class="flex min-h-[64px] flex-none items-center justify-end gap-2 p-4 transition-shadow duration-2 ease-standard motion-reduce:transition-none"
        :class="
          moreBelow
            ? 'shadow-[inset_0_1px_0_var(--c-border-separator)]'
            : 'shadow-none'
        "
      >
        <button
          ref="cancelEl"
          type="button"
          :class="[btn, secondary]"
          @click="dismiss"
        >
          {{ cancelLabel }}
        </button>
        <button
          ref="confirmEl"
          type="button"
          :aria-disabled="loading || undefined"
          :aria-busy="loading || undefined"
          :class="[
            btn,
            variant === 'destructive' ? danger : primary,
            loading && 'cursor-progress',
          ]"
          @click="commit"
        >
          <span
            v-if="loading"
            aria-hidden="true"
            class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-[spin_1.4s_linear_infinite]"
          />
          {{ confirmLabel }}
        </button>
      </footer>
    </div>
  </dialog>
</template>
