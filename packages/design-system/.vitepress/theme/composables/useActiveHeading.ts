import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  readonly,
  ref,
  watch,
} from "vue";

export const useActiveHeading = (ids: () => string[]) => {
  const active = ref<string>();

  const measure = () => {
    const offsets = ids().flatMap((id) => {
      const element = document.getElementById(id);
      return element === null
        ? []
        : [{ id, top: element.getBoundingClientRect().top }];
    });

    if (offsets.length === 0) {
      active.value = undefined;
      return;
    }

    const passed = offsets.filter((entry) => entry.top <= 96);
    active.value = (passed.at(-1) ?? offsets[0])?.id;
  };

  onMounted(() => {
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", measure);
    window.removeEventListener("resize", measure);
  });

  watch(ids, () => {
    void nextTick(measure);
  });

  return readonly(active);
};
