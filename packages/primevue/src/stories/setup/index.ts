import { defineSetupVue3 } from "@histoire/plugin-vue";
import PrimeVue from "primevue/config";

import { Classic } from "../../classic";

import "./setup.css";
import Wrapper from "./Wrapper.vue";

export const setupVue3 = defineSetupVue3(
  ({ app, story, variant, addWrapper }) => {
    addWrapper(Wrapper);

    app.use(PrimeVue, {
      unstyled: true,
      pt: Classic,
    });
  },
);
