import {defineComponent} from "./utils";

export default defineComponent({
  tokens: {
    checkbox: {
      checked: {
        background: "{secondary.color}",
        borderColor: "{secondary.color}",
        hover: {
          background: "{secondary.hoverColor}",
          borderColor: "{secondary.color}"
        },
        focus: {
          borderColor: "{secondary.color}"
        }
      },
      icon: {
        checked: {
          color: "{secondary.contrastColor}",
          hoverColor: "{secondary.contrastColor}"
        }
      }
    }
  }
});
