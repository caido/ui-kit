import {defineComponent} from "./utils";

export default defineComponent({
  tokens: {
    datatable: {
          colorScheme: {
            dark: {
              bodyCell: {
                selectedBorderColor: "transparent",
              }
            }
          },
          headerCell: {
            color: "{text.muted.color}",
            borderColor: "{surface.900}"
          }
        }
  }
});
