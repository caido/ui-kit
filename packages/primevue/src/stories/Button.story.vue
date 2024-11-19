<script setup>
import Button from 'primevue/button'

const severities = [undefined, 'secondary', 'success', 'info', 'warn', 'danger', 'contrast']
const sizes = ['small', undefined, 'large']
</script>

<template>
    <Story title="Button">
        <Variant title="Severity">
            <div class="flex flex-wrap gap-2">
                <div v-for="severity in severities" :key="severity">
                    <Button :severity="severity" :label="severity ?? 'primary'"></Button>
                </div>
            </div>
        </Variant>

        <Variant title="Size">
            <div class="flex flex-wrap gap-2 items-center">
                <div v-for="size in sizes" :key="size">
                    <Button :size="size" :label="size ?? 'default'"></Button>
                </div>
            </div>
        </Variant>
    </Story>
</template>