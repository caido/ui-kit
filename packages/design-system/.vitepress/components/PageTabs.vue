<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

import { setTabHandle } from "../composables/pageTabs";

const props = withDefaults(
  defineProps<{ tabs: string[]; initial?: number }>(),
  { initial: 0 },
);

const active = ref(props.initial);
const slugs = computed(() =>
  props.tabs.map((t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
);

const publish = () => {
  setTabHandle({
    tabs: props.tabs,
    slugs: slugs.value,
    active: active.value,
    panelId: `panel-${slugs.value[active.value]}`,
  });
};

watch([active, slugs], publish, { immediate: true });
onMounted(publish);
onUnmounted(() => setTabHandle(undefined));

function onKey(e: KeyboardEvent) {
  const last = props.tabs.length - 1;
  const map: Record<string, number> = {
    ArrowRight: active.value === last ? 0 : active.value + 1,
    ArrowLeft: active.value === 0 ? last : active.value - 1,
    Home: 0,
    End: last,
  };
  const next = map[e.key];
  if (next === undefined) return;
  e.preventDefault();
  active.value = next;
  document.getElementById(`tab-${slugs.value[next]}`)?.focus();
}
</script>

<template>
  <div class="my-7">
    <div
      role="tablist"
      class="inline-flex gap-1 rounded-lg border border-separator bg-inset p-1"
      @keydown="onKey"
    >
      <button
        v-for="(tab, i) in tabs"
        :id="`tab-${slugs[i]}`"
        :key="tab"
        role="tab"
        type="button"
        :aria-selected="active === i"
        :aria-controls="`panel-${slugs[i]}`"
        :tabindex="active === i ? 0 : -1"
        class="h-md cursor-pointer rounded-md border-0 px-4 text-body transition duration-2 ease-standard focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]"
        :class="
          active === i
            ? 'bg-raised font-semibold text-ink shadow-[0_1px_3px_rgb(0_0_0_/_0.22)]'
            : 'bg-transparent font-medium text-ink-muted hover:bg-selected hover:text-ink'
        "
        @click="active = i"
      >
        {{ tab }}
      </button>
    </div>

    <div
      v-for="(tab, i) in tabs"
      v-show="active === i"
      :id="`panel-${slugs[i]}`"
      :key="tab"
      role="tabpanel"
      :aria-labelledby="`tab-${slugs[i]}`"
      tabindex="0"
      class="pt-7 focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--c-focus-ring)]"
    >
      <slot :name="slugs[i]" />
    </div>
  </div>
</template>

<style>
@media print {
  [role="tablist"] {
    display: none;
  }
  [role="tabpanel"] {
    display: block !important;
  }
}
</style>
