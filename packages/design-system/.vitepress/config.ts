import tailwindcss from "@tailwindcss/vite";
import { defineConfigWithTheme } from "vitepress";

import { navigation, type ThemeConfig } from "./navigation.ts";
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
  },
  vite: { plugins: [tailwindcss()] },
});
