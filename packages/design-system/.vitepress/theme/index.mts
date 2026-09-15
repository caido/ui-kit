import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "@fortawesome/fontawesome-free/css/solid.css";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

import CaidoMock from "../components/CaidoMock.vue";
import DoDont from "../components/DoDont.vue";
import PageTabs from "../components/PageTabs.vue";
import Preview from "../components/Preview.vue";
import Ramp from "../components/Ramp.vue";
import Specimen from "../components/Specimen.vue";
import Swatches from "../components/Swatches.vue";
import ThemeCompare from "../components/ThemeCompare.vue";
import TokenSearch from "../components/TokenSearch.vue";
import DsAlert from "../components/ui/DsAlert.vue";
import DsButton from "../components/ui/DsButton.vue";
import DsCard from "../components/ui/DsCard.vue";
import DsChoice from "../components/ui/DsChoice.vue";
import DsDialog from "../components/ui/DsDialog.vue";
import DsIcon from "../components/ui/DsIcon.vue";
import DsInput from "../components/ui/DsInput.vue";
import DsMenu from "../components/ui/DsMenu.vue";
import DsSelect from "../components/ui/DsSelect.vue";
import DsSkeleton from "../components/ui/DsSkeleton.vue";
import DsSplitPane from "../components/ui/DsSplitPane.vue";
import DsTable from "../components/ui/DsTable.vue";
import DsTabs from "../components/ui/DsTabs.vue";
import DsTag from "../components/ui/DsTag.vue";

import "./custom.css";
import Layout from "./Layout.vue";
import "./tailwind.css";

const docs = {
  DoDont,
  PageTabs,
  Preview,
  Ramp,
  TokenSearch,
  Specimen,
  Swatches,
  ThemeCompare,
  CaidoMock,
};
const ui = {
  DsAlert,
  DsButton,
  DsCard,
  DsChoice,
  DsDialog,
  DsIcon,
  DsInput,
  DsMenu,
  DsSelect,
  DsSkeleton,
  DsSplitPane,
  DsTable,
  DsTabs,
  DsTag,
};

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    for (const [name, component] of Object.entries({ ...docs, ...ui })) {
      app.component(name, component);
    }
  },
} satisfies Theme;
