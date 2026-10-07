import tailwindcss from "@tailwindcss/vite";
import { defineConfigWithTheme } from "vitepress";

import { codeMarks } from "./codeMarks.ts";
import { navigation, type ThemeConfig } from "./navigation.ts";
import { tableScroll } from "./tableScroll.ts";
import { APPEARANCE_SCRIPT } from "./theme/composables/useAppearance.ts";

export default defineConfigWithTheme<ThemeConfig>({
  title: "Caido Design System",
  description: "The vocabulary Caido and its plugins are built from",
  srcDir: "docs",
  cleanUrls: true,
  appearance: false,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["script", {}, APPEARANCE_SCRIPT],
  ],
  themeConfig: { navigation, search: { provider: "local" } },
  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
    headers: { level: [2, 3] },
    config: (md) => {
      codeMarks(md);
      tableScroll(md);
    },
  },
  vite: { plugins: [tailwindcss()] },
});
