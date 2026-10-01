import { nextTick, onMounted, readonly, type Ref, ref, watch } from "vue";

const channel = (value: number) => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const toRgb = (colour: string): [number, number, number] | undefined => {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (context === null) return undefined;

  const before = context.fillStyle;
  context.fillStyle = colour;
  if (context.fillStyle === before && colour !== before) return undefined;

  context.fillRect(0, 0, 1, 1);

  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return r === undefined || g === undefined || b === undefined
    ? undefined
    : [r, g, b];
};

const luminance = (rgb: [number, number, number]) =>
  0.2126 * channel(rgb[0]) +
  0.7152 * channel(rgb[1]) +
  0.0722 * channel(rgb[2]);

export const useContrast = (element: Ref<HTMLElement | undefined>) => {
  const ratio = ref<number>();

  const measure = () => {
    const node = element.value;
    if (node === undefined) return;

    const style = getComputedStyle(node);
    const fg = toRgb(style.color);
    const bg = toRgb(style.backgroundColor);
    if (fg === undefined || bg === undefined) return;

    const a = luminance(fg);
    const b = luminance(bg);
    ratio.value = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };

  onMounted(() => {
    void nextTick(measure);
  });

  watch(element, measure);

  return { ratio: readonly(ratio), measure };
};
