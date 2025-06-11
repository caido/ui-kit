<script setup lang="ts">
import Card from "primevue/card";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
</script>

<template>
  <Story title="Splitter">
    <Variant title="Default">
      <div class="w-full">
        <Splitter>
          <SplitterPanel>
            <Card>
              <template #title> Left Panel </template>
            </Card>
          </SplitterPanel>
          <SplitterPanel>
            <Card>
              <template #title> Middle Panel </template>
            </Card>
          </SplitterPanel>
          <SplitterPanel>
            <Card>
              <template #title> Right Panel </template>
            </Card>
          </SplitterPanel>
        </Splitter>
      </div>
    </Variant>

    <Variant title="Nested">
      <div class="w-full h-[300px]">
        <Splitter class="h-full">
          <SplitterPanel>
            <Splitter class="h-full" layout="vertical">
              <SplitterPanel>
                <Card class="h-full">
                  <template #title> Nested Top </template>
                </Card>
              </SplitterPanel>
              <SplitterPanel>
                <Card class="h-full">
                  <template #title> Nested Bottom </template>
                </Card>
              </SplitterPanel>
            </Splitter>
          </SplitterPanel>
          <SplitterPanel>
            <Card>
              <template #title> Right Panel </template>
            </Card>
          </SplitterPanel>
        </Splitter>
      </div>
    </Variant>
  </Story>
</template>
