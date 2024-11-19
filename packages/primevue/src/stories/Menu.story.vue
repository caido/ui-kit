<script setup lang="ts">
import Menu from 'primevue/menu'
import Button from 'primevue/button'
import { ref } from 'vue'

const menu = ref()

const items = [
    {
        label: 'Options',
        items: [
            {
                label: 'New',
                icon: 'fa-solid fa-plus',
                command: () => {
                    // handle new
                }
            },
            {
                label: 'Delete',
                icon: 'fa-solid fa-trash',
                command: () => {
                    // handle delete
                }
            }
        ]
    },
    {
        separator: true
    },
    {
        label: 'Navigate',
        items: [
            {
                label: 'Home',
                icon: 'fa-solid fa-home'
            },
            {
                label: 'Settings',
                icon: 'fa-solid fa-cog'
            }
        ]
    }
]

const toggle = (event: Event) => {
    menu.value?.toggle(event)
}
</script>

<template>
    <Story title="Menu">
        <Variant title="States">
            <div class="flex flex-col gap-4">
                <span class="text-surface-300 text-lg">Static Menu</span>
                <div class="card flex justify-start">
                    <Menu :model="items" />
                </div>

                <span class="text-surface-300 text-lg">Popup Menu</span>
                <div class="card flex justify-start">
                    <Button @click="toggle" label="Show" />
                    <Menu ref="menu" :model="items" :popup="true" />
                </div>
            </div>
        </Variant>
    </Story>
</template> 