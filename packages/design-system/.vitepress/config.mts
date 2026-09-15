import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Caido Design System",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["link", { rel: "alternate icon", href: "/favicon.ico" }],
  ],
  description:
    "One contrast contract, two themes, every value derived from a named rule.",
  srcDir: "docs",
  vite: {
    css: { postcss: { plugins: [tailwindcss(), autoprefixer()] } },

    server: {
      watch: { ignored: ["**/.vitepress/dist/**", "**/.vitepress/cache/**"] },
    },
  },

  srcExclude: ["_tokens/**", "**/README.md"],
  cleanUrls: true,
  lastUpdated: true,
  appearance: "dark",

  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
    lineNumbers: false,
  },

  themeConfig: {
    logo: { src: "/logo.svg", alt: "Caido" },
    siteTitle: "Design System",

    nav: [
      { text: "Foundations", link: "/foundations/colour" },
      { text: "Components", link: "/components/button" },
      { text: "Implementation", link: "/implementation/current-state" },
    ],

    search: { provider: "local" },

    outline: { level: [2, 3], label: "Contents" },

    sidebar: [
      {
        text: "Get started",
        items: [
          { text: "Overview", link: "/" },
          { text: "Principles", link: "/principles" },
          { text: "How to read a spec", link: "/how-to-read-a-spec" },
        ],
      },
      {
        text: "Foundations",
        collapsed: false,
        items: [
          { text: "Colour", link: "/foundations/colour" },
          { text: "Typography", link: "/foundations/typography" },
          { text: "Spacing", link: "/foundations/spacing" },
          {
            text: "Radius, borders, elevation",
            link: "/foundations/radius-borders-elevation",
          },
          { text: "Motion", link: "/foundations/motion" },
          { text: "Iconography", link: "/foundations/iconography" },
          { text: "Accessibility", link: "/foundations/accessibility" },
        ],
      },
      {
        text: "Components",
        collapsed: false,
        items: [
          { text: "Button", link: "/components/button" },
          { text: "Text input", link: "/components/text-input" },
          { text: "Data table", link: "/components/data-table" },
          { text: "Split pane", link: "/components/split-pane" },
          { text: "Context menu", link: "/components/context-menu" },
          { text: "Dialog", link: "/components/dialog" },
          { text: "Card and surface", link: "/components/card-surface" },
          { text: "Select", link: "/components/select" },
          {
            text: "Skeleton and loading",
            link: "/components/skeleton-loading",
          },
          { text: "Tag and badge", link: "/components/tag-badge" },
          {
            text: "Checkbox, radio, toggle",
            link: "/components/checkbox-radio-toggle",
          },
          { text: "Toast and alert", link: "/components/toast-alert" },
          { text: "Tabs", link: "/components/tabs" },
        ],
      },
      {
        text: "Implementation",
        collapsed: false,
        items: [
          { text: "Tokens", link: "/tokens" },
          { text: "Current state", link: "/implementation/current-state" },
          { text: "Migration", link: "/implementation/migration" },
          { text: "What changed", link: "/changelog" },
        ],
      },
      {
        text: "Appendix",
        collapsed: true,
        items: [{ text: "Typefaces", link: "/appendix-typefaces" }],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/caido/caido" }],
  },
});
