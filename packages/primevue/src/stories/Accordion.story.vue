<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import { ref } from "vue";

const activeIndex = ref(0);
</script>

<template>
  <Story title="Accordion">
    <Variant title="Default">
      <Accordion :active-index="activeIndex">
        <AccordionTab header="Header I">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </AccordionTab>
        <AccordionTab header="Header II">
          <p>
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </AccordionTab>
        <AccordionTab header="Header III">
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
        </AccordionTab>
      </Accordion>
    </Variant>

    <Variant title="Multiple">
      <Accordion :multiple="true">
        <AccordionTab header="Header I">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </AccordionTab>
        <AccordionTab header="Header II">
          <p>
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </AccordionTab>
        <AccordionTab header="Header III">
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
        </AccordionTab>
      </Accordion>
    </Variant>

    <Variant title="Disabled">
      <Accordion>
        <AccordionTab header="Header I">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </AccordionTab>
        <AccordionTab header="Header II" :disabled="true">
          <p>
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </AccordionTab>
        <AccordionTab header="Header III">
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
        </AccordionTab>
      </Accordion>
    </Variant>
  </Story>
</template>
