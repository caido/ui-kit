<script setup lang="ts">
type Token = { name: string; hex: string; job?: string };
const props = defineProps<{ tokens: Token[]; caption?: string }>();

const srgbToLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

function parseHex(hex: string) {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function toHsl([r, g, b]: number[]) {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return `0deg 0% ${Math.round(l * 100)}%`;
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return `${h}deg ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}

function toOklch([r, g, b]: number[]) {
  const lr = srgbToLinear(r / 255),
    lg = srgbToLinear(g / 255),
    lb = srgbToLinear(b / 255);
  const l_ = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m_ = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s_ = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.sqrt(a * a + bb * bb);
  let H = (Math.atan2(bb, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return `${L.toFixed(4)} ${C.toFixed(4)} ${H.toFixed(1)}`;
}

const rows = props.tokens.map((t) => {
  const rgb = parseHex(t.hex);
  return {
    ...t,
    hex: t.hex.toUpperCase(),
    rgb: rgb.join(" "),
    hsl: toHsl(rgb),
    oklch: toOklch(rgb),
  };
});

function copy(value: string) {
  if (typeof navigator !== "undefined" && "clipboard" in navigator) {
    void navigator.clipboard.writeText(value);
  }
}
</script>

<template>
  <div class="ds-swatches">
    <div class="ds-swatch-row is-head">
      <span></span><span>Token</span><span>Hex</span><span>RGB</span
      ><span>HSL</span><span>OKLCH</span>
    </div>
    <div v-for="row in rows" :key="row.name" class="ds-swatch-row">
      <span
        class="ds-chip"
        :style="{ background: row.hex }"
        :title="row.job"
      ></span>
      <span class="ds-swatch-name">{{ row.name }}</span>
      <button class="ds-copy" @click="copy(row.hex)">{{ row.hex }}</button>
      <button class="ds-copy" @click="copy(row.rgb)">{{ row.rgb }}</button>
      <button class="ds-copy" @click="copy(row.hsl)">{{ row.hsl }}</button>
      <button class="ds-copy" @click="copy(row.oklch)">{{ row.oklch }}</button>
    </div>
  </div>
  <p v-if="caption" class="ds-caption">{{ caption }}</p>
</template>
