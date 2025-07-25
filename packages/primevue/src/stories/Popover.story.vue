<script setup lang="ts">
import Button from "primevue/button";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputText from "primevue/inputtext";
import Popover from "primevue/popover";
import { ref } from "vue";

const [opLeft, opRight] = [ref(), ref()];
const members = ref([
  {
    name: "Amy Elsner",
    image: "amyelsner.png",
    email: "amy@email.com",
    role: "Owner",
  },
  {
    name: "Bernardo Dominic",
    image: "bernardodominic.png",
    email: "bernardo@email.com",
    role: "Editor",
  },
  {
    name: "Ioni Bowcher",
    image: "ionibowcher.png",
    email: "ioni@email.com",
    role: "Viewer",
  },
]);

const toggleLeft = (event) => {
  opLeft.value.toggle(event);
};

const toggleRight = (event) => {
  opRight.value.toggle(event);
};
</script>

<template>
  <Story title="Popover">
    <Variant title="Left arrow">
      <Button
        type="button"
        label="Share"
        icon="fas fa-magnifying-glass"
        @click="toggleLeft"
      />

      <Popover ref="opLeft">
        <div class="flex flex-col gap-4 w-[25rem]">
          <div>
            <span class="font-medium block mb-2">Share this document</span>
            <InputGroup>
              <InputText
                value="https://primevue.org/12323ff26t2g243g423g234gg52hy25XADXAG3"
                readonly
                class="w-[25rem]"
              ></InputText>
              <InputGroupAddon>
                <i class="fa-solid fa-copy"></i>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div>
            <span class="font-medium block mb-2">Invite Member</span>
            <InputGroup>
              <InputText disabled />
              <Button label="Invite" icon="fa-solid fa-user"></Button>
            </InputGroup>
          </div>
          <div>
            <span class="font-medium block mb-2">Team Members</span>
            <ul class="list-none p-0 m-0 flex flex-col gap-4">
              <li
                v-for="member in members"
                :key="member.name"
                class="flex items-center gap-2"
              >
                <img
                  :src="`https://primefaces.org/cdn/primevue/images/avatar/${member.image}`"
                  style="width: 32px"
                />
                <div>
                  <span class="font-medium">{{ member.name }}</span>
                  <div class="text-sm text-surface-500 dark:text-surface-400">
                    {{ member.email }}
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 text-surface-500 dark:text-surface-400 ml-auto text-sm"
                >
                  <span>{{ member.role }}</span>
                  <i class="fa-solid fa-chevron-down"></i>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Popover>
    </Variant>
    <Variant title="Right arrow">
      <div class="flex w-full flex-row-reverse">
        <Button
          type="button"
          label="Share"
          icon="fas fa-magnifying-glass"
          @click="toggleRight"
        />

        <Popover ref="opRight" pt:root:data-arrow-right="true">
          <div class="flex flex-col gap-4 w-[25rem]">
            <div>
              <span class="font-medium block mb-2">Share this document</span>
              <InputGroup>
                <InputText
                  value="https://primevue.org/12323ff26t2g243g423g234gg52hy25XADXAG3"
                  readonly
                  class="w-[25rem]"
                ></InputText>
                <InputGroupAddon>
                  <i class="fa-solid fa-copy"></i>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div>
              <span class="font-medium block mb-2">Invite Member</span>
              <InputGroup>
                <InputText disabled />
                <Button label="Invite" icon="fa-solid fa-user"></Button>
              </InputGroup>
            </div>
            <div>
              <span class="font-medium block mb-2">Team Members</span>
              <ul class="list-none p-0 m-0 flex flex-col gap-4">
                <li
                  v-for="member in members"
                  :key="member.name"
                  class="flex items-center gap-2"
                >
                  <img
                    :src="`https://primefaces.org/cdn/primevue/images/avatar/${member.image}`"
                    style="width: 32px"
                  />
                  <div>
                    <span class="font-medium">{{ member.name }}</span>
                    <div class="text-sm text-surface-500 dark:text-surface-400">
                      {{ member.email }}
                    </div>
                  </div>
                  <div
                    class="flex items-center gap-2 text-surface-500 dark:text-surface-400 ml-auto text-sm"
                  >
                    <span>{{ member.role }}</span>
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Popover>
      </div>
    </Variant>
  </Story>
</template>
