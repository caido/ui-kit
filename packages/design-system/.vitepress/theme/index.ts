import "@caido/tokens/fonts.css";
import "@fortawesome/fontawesome-free/css/all.css";
import type { Theme } from "vitepress";

import { registerContentComponents } from "./content/index.ts";
import Layout from "./Layout.vue";
import "./styles/index.css";

export default {
  Layout,
  enhanceApp: ({ app }) => {
    registerContentComponents(app);
  },
} satisfies Theme;
