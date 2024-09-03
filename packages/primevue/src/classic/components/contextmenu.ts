import {defineComponent} from "./utils";

export default defineComponent({
  tokens: {
    contextmenu: {
      root: {
        borderColor: '{gray.700}',
        background: '{gray.900}'
      },
      separator: {
        borderColor: '{gray.700}'
      }
    },
  }
});
