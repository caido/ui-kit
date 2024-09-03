import {defineComponent} from "./utils";

export default defineComponent({
  tokens: {
    column: {
      headerCell: {
        borderWidth: "0.2rem 0 0.2rem 0",
      }
    }
  },
  passthrough: {
    column: {
      headerCell: {
        style: {
          borderWidth: "var(--p-column-header-cell-border-width)",
        },
      },
    },
  }
});
