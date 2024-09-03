import {defineComponent} from "./utils";

export default defineComponent({
  tokens: {
    datatable: {
      colorScheme: {
        dark: {
          bodyCell: {
            selectedBorderColor: "transparent",
          },
          headerCell: {
            background: "#2b2e35"
          }
        }
      },
      headerCell: {
        color: "{text.muted.color}",
        borderColor: "{surface.900}"
      },
      columnTitle: {
        fontWeight: "400",
      }
    }
  },
});
