import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";

import splitter from "./components/splitter";
import card from "./components/card";
import datatable from "./components/datatable";
import menubar from "./components/menubar";
import column from "./components/column";
import checkbox from "./components/checkbox";

export const ClassicTheme = definePreset(Aura, {
  primitive: {
    red: {
      900: "#3f0c16",
      800: "#641224",
      700: "#8c1c35",
      600: "#a0213e",
      500: "#df3259",
      400: "#f25d74",
      300: "#f58e97",
      200: "#f7b5b9"
    },
    yellow: {
      900: "#281e0f",
      800: "#433014",
      700: "#60441c",
      600: "#7c5a26",
      500: "#9b7132",
      400: "#b9883e",
      300: "#daa04a",
      200: "#f1bc74"
    },
    green: {
      900: "#122312",
      800: "#1d3a1d",
      700: "#2b532b",
      600: "#3a6c3a",
      500: "#4a874a",
      400: "#579c57",
      300: "#6cbf6c",
      200: "#7fdb7f"
    },
    blue: {
      100: "#88a2aa"
    },
    gray: {
      900: "#25272d",
      800: "#2f323a",
      700: "#484c57",
      600: "#616161",
      500: "#797979",
      400: "#929292",
      300: "#acacac",
      200: "#c6c6c6"
    },
    white: {
      100: "#edeae8"
    },

    borderRadius: {
      none: "0",
      xs: "0.125rem",
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
    },

    boxShadow: {
      sm: "0px 1px 0px 0px rgb(1, 4, 9)",
      md: "0px 8px 24px 0px rgb(1, 4, 9)",
    },
  },

  semantic: {
    primary: {
      900: "{red.900}",
      800: "{red.800}",
      700: "{red.700}",
      600: "{red.600}",
      500: "{red.500}",
      400: "{red.400}",
      300: "{red.300}",
      200: "{red.200}",
    },
    secondary: {
      900: "{yellow.900}",
      800: "{yellow.800}",
      700: "{yellow.700}",
      600: "{yellow.600}",
      500: "{yellow.500}",
      400: "{yellow.400}",
      300: "{yellow.300}",
      200: "{yellow.200}",
    },
    focusRing: {
        color: '{secondary.color}',
    },
    colorScheme: {
      dark: {
        content: {
          background: '{gray.800}',
          borderColor: "unset",
        },
        surface: {
          950: '{gray.900}',
          900: '{gray.900}',
          800: '{gray.800}',
          700: '{gray.700}',
          600: '{gray.600}',
          500: '{gray.500}',
          400: '{gray.400}',
          300: '{gray.300}',
          200: '{gray.200}',
        },
        primary: {
          color: '{primary.600}',
          contrastColor: '{white.100}',
          hoverColor: "{primary.700}",
          activeColor: "{primary.800}"
        },
        secondary: {
          color: '{secondary.300}',
          contrastColor: '#000000',
          hoverColor: '{secondary.400}',
        },
        highlight: {
          background: 'rgba(255, 255, 255, 0.2)',
        },
        formField: {
          focusBorderColor: '{secondary.color}',
        },
      }
    },
    content: {
      borderRadius: "{borderRadius.sm}",
    },
    boxShadow: {
      surface: '0 1px 5px #0003,0 2px 2px #00000024,0 3px 1px -2px #0000001f'
    },
  },
  components: {
    ...card.tokens,
    ...column.tokens,
    ...datatable.tokens,
    ...menubar.tokens,
    ...splitter.passthrough,
    ...checkbox.tokens,
  }
});

export const ClassicThemePassthrough = {
  ...card.passthrough,
  ...column.passthrough,
  ...datatable.passthrough,
  ...menubar.passthrough,
  ...splitter.passthrough,
  ...checkbox.passthrough,
} as const
