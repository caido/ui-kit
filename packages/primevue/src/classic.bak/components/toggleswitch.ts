import {defineComponent} from "./utils";

export default defineComponent({
  tokens: {
    toggleswitch: {
      colorScheme: {
        dark: {
          root: {
            checkedBackground: "{secondary.color}",
            checkedHoverBackground: "{secondary.hover.color}",
          }
        }
      }
    },
  },
  passthrough: {
  }
});
