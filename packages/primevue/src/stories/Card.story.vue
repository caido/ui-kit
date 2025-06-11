<script setup lang="ts">
import Button from "primevue/button";
import Card from "primevue/card";
</script>

<template>
  <Story title="Card">
    <Variant title="Basic">
      <div class="w-[400px]">
        <Card>
          <template #title> Simple Card </template>
          <template #content>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
            sed consequuntur error repudiandae numquam deserunt quisquam
            repellat libero asperiores earum nam nobis.
          </template>
        </Card>
      </div>
    </Variant>

    <Variant title="With Header and Footer">
      <div class="w-[400px]">
        <Card>
          <template #title> Advanced Card </template>
          <template #subtitle> Card subtitle </template>
          <template #content>
            <div class="flex flex-col gap-4">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Inventore sed consequuntur error repudiandae numquam deserunt
                quisquam repellat libero asperiores earum nam nobis.
              </p>
              <img
                src="https://picsum.photos/400/200"
                alt="Card image"
                class="rounded-md"
              />
            </div>
          </template>
          <template #footer>
            <div class="flex justify-end gap-2">
              <Button label="Cancel" text />
              <Button label="Save" />
            </div>
          </template>
        </Card>
      </div>
    </Variant>

    <Variant title="Content Only">
      <div class="w-[400px]">
        <Card>
          <template #content>
            <div class="flex flex-col gap-4">
              <img
                src="https://picsum.photos/400/200"
                alt="Card image"
                class="rounded-md"
              />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Inventore sed consequuntur error repudiandae numquam deserunt.
              </p>
            </div>
          </template>
        </Card>
      </div>
    </Variant>
  </Story>
</template>
