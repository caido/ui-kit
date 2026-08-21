export default {
  content: ["./.vitepress/**/*.{vue,ts,mts,js}", "./docs/**/*.md"],
  darkMode: ["selector", '[data-mode="dark"]'],

  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        canvas: "var(--c-bg-canvas)",
        subtle: "var(--c-bg-subtle)",
        raised: "var(--c-bg-raised)",
        inset: "var(--c-bg-inset)",
        selected: "var(--c-bg-selected)",
        disabled: "var(--c-bg-disabled)",
        ink: "var(--c-fg-default)",
        "ink-muted": "var(--c-fg-muted)",
        "ink-faint": "var(--c-fg-faint)",
        "ink-onsolid": "var(--c-fg-onsolid)",
        separator: "var(--c-border-separator)",
        control: "var(--c-border-control)",
        accent: "var(--c-accent-solid)",
        "accent-ink": "var(--c-accent-fg)",
        "gold-ink": "var(--c-gold-fg)",
        "danger-ink": "var(--c-danger-fg)",
        "success-ink": "var(--c-success-fg)",
        "info-ink": "var(--c-info-fg)",
        "tag-row": "var(--c-tag-row)",
        "tag-ink": "var(--c-tag-ink)",

        skeleton: "var(--c-skeleton)",

        "gutter-handle": "var(--c-gutter-handle)",

        "row-zebra": "var(--c-row-zebra)",
        "row-hover": "var(--c-row-hover)",
        "row-selected": "var(--c-row-selected)",

        pressed: "var(--c-state-pressed)",

        header: "var(--c-bg-header)",
      },
      borderColor: {
        DEFAULT: "var(--c-border-separator)",
        "accent-ink": "var(--c-accent-fg)",

        line: "var(--c-border-line)",
      },

      height: { xs: "24px", sm: "28px", md: "32px", lg: "40px", xl: "48px" },
      width: { xs: "24px", sm: "28px", md: "32px", lg: "40px", xl: "48px" },
      minHeight: { xs: "24px", sm: "28px", md: "32px", lg: "40px", xl: "48px" },

      borderRadius: { xs: "2px", sm: "4px", md: "6px", lg: "10px" },

      fontSize: {
        caption: ["12px", "16px"],
        code: ["13px", "18px"],
        dense: ["14px", "18px"],
        body: ["14px", "20px"],
        title: ["16px", "24px"],
        heading: ["20px", "28px"],
        display: ["32px", "40px"],
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        mono: ['"Courier New"', "Courier", "monospace"],
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0.38, 0.9)",
        enter: "cubic-bezier(0, 0, 0.38, 0.9)",
        exit: "cubic-bezier(0.2, 0, 1, 0.9)",
      },
      transitionDuration: { 1: "70ms", 2: "110ms", 3: "150ms", 4: "240ms" },

      keyframes: {
        sheen: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(350%)" },
        },
        sweep: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(400%)" },
        },
      },
      animation: {
        sheen: "sheen 1600ms linear 3",
        sweep: "sweep 1600ms linear infinite",
      },
    },
  },
};
