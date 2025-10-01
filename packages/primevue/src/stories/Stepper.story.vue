<script setup lang="ts">
import Button from "primevue/button";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Step from "primevue/step";
import StepList from "primevue/steplist";
import StepPanel from "primevue/steppanel";
import StepPanels from "primevue/steppanels";
import Stepper from "primevue/stepper";
import { ref } from "vue";

const activeStep = ref(1);

const nextStep = () => {
  if (activeStep.value < 3) {
    activeStep.value++;
  }
};

const prevStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--;
  }
};
</script>

<template>
  <Story title="Stepper">
    <Variant title="Basic">
      <div class="w-full max-w-4xl">
        <Stepper v-model:value="activeStep">
          <StepList>
            <Step :value="1">Personal Information</Step>
            <Step :value="2">Contact Details</Step>
            <Step :value="3">Review & Confirm</Step>
          </StepList>

          <StepPanels>
            <StepPanel :value="1">
              <Card class="p-4">
                <template #content>
                  <h3 class="text-lg font-semibold mb-4">
                    Personal Information
                  </h3>
                  <div class="flex flex-col gap-4">
                    <div>
                      <label class="block text-sm font-medium mb-2"
                        >First Name</label
                      >
                      <InputText
                        placeholder="Enter your first name"
                        class="w-full"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2"
                        >Last Name</label
                      >
                      <InputText
                        placeholder="Enter your last name"
                        class="w-full"
                      />
                    </div>
                  </div>
                </template>
              </Card>
            </StepPanel>
            <StepPanel :value="2">
              <Card class="p-4">
                <template #content>
                  <h3 class="text-lg font-semibold mb-4">Contact Details</h3>
                  <div class="flex flex-col gap-4">
                    <div>
                      <label class="block text-sm font-medium mb-2"
                        >Email</label
                      >
                      <InputText
                        placeholder="Enter your email"
                        class="w-full"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2"
                        >Phone</label
                      >
                      <InputText
                        placeholder="Enter your phone number"
                        class="w-full"
                      />
                    </div>
                  </div>
                </template>
              </Card>
            </StepPanel>
            <StepPanel :value="3">
              <Card class="p-4">
                <template #content>
                  <h3 class="text-lg font-semibold mb-4">Review & Confirm</h3>
                  <p class="text-surface-600 dark:text-surface-300">
                    Please review your information before proceeding.
                  </p>
                </template>
              </Card>
            </StepPanel>
          </StepPanels>
        </Stepper>

        <div class="flex justify-between mt-6">
          <Button
            v-if="activeStep > 1"
            label="Previous"
            severity="contrast"
            @click="prevStep"
          />
          <div v-else></div>
          <Button
            v-if="activeStep < 3"
            label="Next"
            icon="fas fa-arrow-right"
            @click="nextStep"
          />
          <Button
            v-else
            label="Complete"
            severity="success"
            icon="fas fa-check"
          />
        </div>
      </div>
    </Variant>

    <Variant title="Disabled Steps">
      <div class="w-full max-w-4xl">
        <Stepper v-model:value="activeStep">
          <StepList>
            <Step :value="1">Step 1</Step>
            <Step :value="2" :disabled="true">Step 2 (Disabled)</Step>
            <Step :value="3" :disabled="true">Step 3 (Disabled)</Step>
          </StepList>

          <StepPanels>
            <StepPanel :value="1">
              <Card class="p-4">
                <template #content>
                  <h3 class="text-lg font-semibold mb-4">Step 1</h3>
                  <p class="text-surface-600 dark:text-surface-300">
                    This is the first step. The next steps are disabled.
                  </p>
                </template>
              </Card>
            </StepPanel>
            <StepPanel :value="2">
              <Card class="p-4">
                <template #content>
                  <h3 class="text-lg font-semibold mb-4">Step 2</h3>
                  <p class="text-surface-600 dark:text-surface-300">
                    This step is disabled and cannot be accessed.
                  </p>
                </template>
              </Card>
            </StepPanel>
            <StepPanel :value="3">
              <Card class="p-4">
                <template #content>
                  <h3 class="text-lg font-semibold mb-4">Step 3</h3>
                  <p class="text-surface-600 dark:text-surface-300">
                    This step is also disabled.
                  </p>
                </template>
              </Card>
            </StepPanel>
          </StepPanels>
        </Stepper>
      </div>
    </Variant>
  </Story>
</template>
