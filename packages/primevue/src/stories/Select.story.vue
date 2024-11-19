<script setup lang="ts">
import Select from 'primevue/select'
import { ref } from 'vue'

const selectedOption = ref();

const options = [
    { label: 'Australia', value: 'AU' },
    { label: 'Brazil', value: 'BR' },
    { label: 'China', value: 'CN' },
    { label: 'Denmark', value: 'DK' },
    { label: 'Egypt', value: 'EG' },
    { label: 'France', value: 'FR' }
]

const groupedOptions = [
    {
        label: 'Europe',
        items: [
            { label: 'France', value: 'FR' },
            { label: 'Denmark', value: 'DK' }
        ]
    },
    {
        label: 'Asia',
        items: [
            { label: 'China', value: 'CN' },
            { label: 'Japan', value: 'JP' }
        ]
    }
]
</script>

<template>
    <Story title="Select">
        <Variant title="States">
            <div class="flex flex-col gap-4 w-[240px]">
                <Select
                    v-model="selectedOption"
                    placeholder="Default"
                    :options="options"
                    optionLabel="label"
                    optionValue="value"
                />
                
                <Select
                    v-model="selectedOption"
                    placeholder="Disabled"
                    :options="options"
                    optionLabel="label"
                    optionValue="value"
                    disabled
                />

                <Select
                    v-model="selectedOption"
                    placeholder="Invalid"
                    :options="options"
                    optionLabel="label"
                    optionValue="value"
                    invalid
                />

                <Select
                    v-model="selectedOption"
                    placeholder="Loading"
                    :options="options"
                    optionLabel="label"
                    optionValue="value"
                    loading
                />

                <Select
                    v-model="selectedOption"
                    placeholder="With Clear"
                    :options="options"
                    optionLabel="label"
                    optionValue="value"
                    showClear
                />
            </div>
        </Variant>

        <Variant title="Groups">
            <div class="flex flex-col gap-4 w-[240px]">
                <Select
                    placeholder="Select a Country"
                    :options="groupedOptions"
                    optionLabel="label"
                    optionValue="value"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                />
            </div>
        </Variant>

        <Variant title="Filter">
            <div class="flex flex-col gap-4 w-[240px]">
                <Select
                    placeholder="Filter Enabled"
                    :options="options"
                    optionLabel="label"
                    optionValue="value"
                    filter
                />
            </div>
        </Variant>
    </Story>
</template> 