<script setup lang="ts">
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";
</script>

<template>
  <Story title="Avatar">
    <Variant title="Label">
      <div class="flex gap-2">
        <Avatar label="P" />
        <Avatar label="V" style="background-color: #2196f3; color: #ffffff" />
        <Avatar label="U" style="background-color: #9c27b0; color: #ffffff" />
      </div>
    </Variant>

    <Variant title="Icon">
      <div class="flex gap-2">
        <Avatar icon="fa-solid fa-user" />
        <Avatar
          icon="fa-solid fa-user"
          style="background-color: #2196f3; color: #ffffff"
        />
        <Avatar
          icon="fa-solid fa-user"
          style="background-color: #9c27b0; color: #ffffff"
        />
      </div>
    </Variant>

    <Variant title="Image">
      <div class="flex gap-2">
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
        />
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png"
        />
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png"
        />
      </div>
    </Variant>

    <Variant title="Group">
      <AvatarGroup class="mb-3">
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          size="large"
        />
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png"
          size="large"
        />
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png"
          size="large"
        />
        <Avatar
          label="+2"
          size="large"
          style="background-color: #9c27b0; color: #ffffff"
        />
      </AvatarGroup>
    </Variant>

    <Variant title="Sizes">
      <div class="flex gap-2 items-center">
        <Avatar label="P" size="large" />
        <Avatar label="P" />
        <Avatar label="P" size="xlarge" />
      </div>
    </Variant>

    <Variant title="Shapes">
      <div class="flex gap-2">
        <Avatar label="P" />
        <Avatar label="P" shape="circle" />
      </div>
    </Variant>
  </Story>
</template>
