import type { App } from "vue";

import ContrastPair from "./ContrastPair.vue";
import DoDont from "./DoDont.vue";
import IconGrid from "./IconGrid.vue";
import Preview from "./Preview.vue";
import Specimen from "./Specimen.vue";
import SwatchPair from "./SwatchPair.vue";
import TokenSwatches from "./TokenSwatches.vue";
import TokenTable from "./TokenTable.vue";

export const registerContentComponents = (app: App) => {
  app.component("ContrastPair", ContrastPair);
  app.component("DoDont", DoDont);
  app.component("IconGrid", IconGrid);
  app.component("Preview", Preview);
  app.component("Specimen", Specimen);
  app.component("SwatchPair", SwatchPair);
  app.component("TokenSwatches", TokenSwatches);
  app.component("TokenTable", TokenTable);
};
