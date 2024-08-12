import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";

// :root {
//   /* Colors */
//   --c-red-900: #3f0c16;
//   --c-red-800: #641224;
//   --c-red-700: #8c1c35;
//   --c-red-600: #a0213e;
//   --c-red-500: #df3259;
//   --c-red-400: #f25d74;
//   --c-red-300: #f58e97;
//   --c-red-200: #f7b5b9;

//   --c-yellow-900: #281e0f;
//   --c-yellow-800: #433014;
//   --c-yellow-700: #60441c;
//   --c-yellow-600: #7c5a26;
//   --c-yellow-500: #9b7132;
//   --c-yellow-400: #b9883e;
//   --c-yellow-300: #daa04a;
//   --c-yellow-200: #f1bc74;

//   --c-green-900: #122312;
//   --c-green-800: #1d3a1d;
//   --c-green-700: #2b532b;
//   --c-green-600: #3a6c3a;
//   --c-green-500: #4a874a;
//   --c-green-400: #579c57;
//   --c-green-300: #6cbf6c;
//   --c-green-200: #7fdb7f;

//   --c-blue-100: #88a2aa;

//   --c-gray-900: #25272d;
//   --c-gray-800: #2f323a;
//   --c-gray-700: #484c57;
//   --c-gray-600: #616161;
//   --c-gray-500: #797979;
//   --c-gray-400: #929292;
//   --c-gray-300: #acacac;
//   --c-gray-200: #c6c6c6;

//   --c-white-100: #edeae8;

//   /* Font-Family */
//   --c-font-family-base: Arial, sans-serif;
//   --c-font-family-mono: "Courier New", monospace;

//   /* Font-sizes */
//   --c-font-size-base: 14px;
//   --c-font-size-75: 0.75rem;
//   --c-font-size-100: 0.875rem;
//   --c-font-size-200: 1rem;
//   --c-font-size-300: 1.125rem;

//   /* Font-weight */
//   --c-font-weight-500: 500;

//   /* Line-height */
//   --c-line-height-base: 1.5;

//   /* Spacing */
//   --c-space-0: 0;
//   --c-space-1: 0.25rem;
//   --c-space-2: 0.50rem;
//   --c-space-3: 0.75rem;
//   --c-space-4: 1rem;
//   --c-space-8: 2rem;
//   --c-space-10: 2.5rem;
//   --c-space-12: 3.0rem;

//   /* Border-radius */
//   --c-border-radius-05: 0.125rem;
//   --c-border-radius-1: 0.25rem;
//   --c-border-radius-2: 0.5rem;
//   --c-border-radius-3: 0.75rem;
//   --c-border-radius-4: 1rem;

//   /* Border */
//   --c-border-width-1: 0.0625rem;
//   --c-border-width-2: 0.125rem;
//   --c-border-width-3: 0.1875rem;
//   --c-border-width-4: 0.25rem;
//   --c-border-width-5: 0.3125rem;

//   /* Box shadow */
//   --c-box-shadow-small: rgb(1, 4, 9) 0px 1px 0px 0px;
//   --c-box-shadow-large: rgb(1, 4, 9) 0px 8px 24px 0px;

//   /* === Background === */
//   /* Background: Foundations */
//   --c-bg-default: var(--c-gray-900);
//   --c-bg-subtle: var(--c-gray-800);
//   --c-bg-inset: var(--c-gray-700);

//   /* Background: Roles */
//   --c-bg-primary: var(--c-red-600);
//   --c-bg-primary--pressed: var(--c-red-700);
//   --c-bg-secondary: var(--c-yellow-300);
//   --c-bg-secondary--pressed: var(--c-yellow-400);
//   --c-bg-tertiary: var(--c-gray-400);
//   --c-bg-tertiary--pressed: var(--c-gray-500);
//   --c-bg-danger: var(--c-red-300);
//   --c-bg-danger--pressed: var(--c-red-400);
//   --c-bg-info: var(--c-blue-100);
//   --c-bg-success: var(--c-green-400);
//   --c-bg-success--pressed: var(--c-green-500);

//   /* === Foreground === */
//   /* Foreground: Foundations */
//   --c-fg-default: var(--c-white-100);
//   --c-fg-subtle: var(--c-gray-400);
//   --c-fg-onEmphasis: var(--c-gray-900);

//   /* Foreground: Roles */
//   --c-fg-primary: var(--c-red-600);
//   --c-fg-primary--pressed: var(--c-red-700);
//   --c-fg-secondary: var(--c-yellow-300);
//   --c-fg-secondary--pressed: var(--c-yellow-400);
//   --c-fg-tertiary: var(--c-gray-400);
//   --c-fg-tertiary--pressed: var(--c-gray-500);
//   --c-fg-danger: var(--c-red-300);
//   --c-fg-danger--pressed: var(--c-red-400);
//   --c-fg-info: var(--c-blue-100);
//   --c-fg-success: var(--c-green-400);
//   --c-fg-success--pressed: var(--c-green-500);

//   /* === Border === */
//   /* Border: Foundations */
//   --c-border-default: var(--c-gray-600);

//   /* Border: Roles */
//   --c-border-primary: var(--c-red-600);
//   --c-border-secondary: var(--c-yellow-300);
//   --c-border-tertiary: var(--c-gray-400);
//   --c-border-danger: var(--c-red-300);
//   --c-border-info: var(--c-blue-100);
//   --c-border-success: var(--c-green-400);

// }
export const CaidoDark = definePreset(Aura, {
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
    colorScheme: {
      dark: {
        content: {
          background: '{gray.800}'
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
        }
      }
    },
    boxShadow: {
      surface: '0 1px 5px #0003,0 2px 2px #00000024,0 3px 1px -2px #0000001f'
    }
  },
  components: {
    splitter: {
      background: 'transparent',
      borderColor: "transparent",
      gutter: {
        background: "transparent"
      },
    },
    card: {
      borderRadius: "{borderRadius.sm}",
    },
    datatable: {
      headerCell: {
        color: "{text.muted.color}",
        borderColor: "{surface.900}"
      }
    }
  }
});
