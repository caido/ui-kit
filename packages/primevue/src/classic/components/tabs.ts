import {defineComponent} from "./utils";

export default defineComponent({
  tokens: {
    tabs: {
      tablist: {
        borderColor: "{gray.900}",
      },
      tab: {
        borderColor: "{gray.900}",
        activeBorderColor: "{secondary.color}",
        hoverBorderColor: "{gray.900}",
        activeColor: "{secondary.color}",
        fontWeight: "400",
      },
      activeBar: {
        background: "{secondary.color}",
      }
    },
  },
  passthrough: {
  }
});
