import { onMounted, readonly, ref } from "vue";

export type Appearance = "light" | "dark";

const STORAGE_KEY = "caido-design-system-appearance";

const read = (): Appearance | undefined => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : undefined;
  } catch {
    return undefined;
  }
};

const write = (value: Appearance) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    return;
  }
};

const stamp = (value: Appearance) => {
  const root = document.documentElement;
  root.setAttribute("data-appearance", value);
  root.setAttribute("data-mode", value);
};

export const APPEARANCE_SCRIPT = `
(function () {
  var stored = null;
  try { stored = localStorage.getItem(${JSON.stringify(STORAGE_KEY)}); } catch (error) {}
  var preferred = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  var appearance = stored === "light" || stored === "dark" ? stored : preferred;
  document.documentElement.setAttribute("data-appearance", appearance);
  document.documentElement.setAttribute("data-mode", appearance);
})();
`.trim();

const appearance = ref<Appearance>("dark");

export const useAppearance = () => {
  onMounted(() => {
    appearance.value =
      read() ??
      (document.documentElement.getAttribute("data-appearance") === "light"
        ? "light"
        : "dark");
  });

  const toggle = () => {
    const next: Appearance = appearance.value === "dark" ? "light" : "dark";
    appearance.value = next;
    stamp(next);
    write(next);
  };

  return { appearance: readonly(appearance), toggle };
};
