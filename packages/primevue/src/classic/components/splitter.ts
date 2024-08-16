import { defineComponent } from "./utils"

export default defineComponent({
  tokens: {
    splitter: {
      background: 'transparent',
      borderColor: "transparent",
      gutter: {
        background: "transparent"
      }
    }
  },
  passthrough: {
    splitterPanel: {
      root: {
        style: {
          overflow: "auto",
          boxShadow: "var(--autorize-box-shadow-surface)",
        },
      },
    },
  }
});
