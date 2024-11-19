<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ref } from 'vue'

const products = ref([
    { code: 'P1', name: 'Laptop', category: 'Electronics', price: 999.99, quantity: 50 },
    { code: 'P2', name: 'Smartphone', category: 'Electronics', price: 699.99, quantity: 100 },
    { code: 'P3', name: 'Headphones', category: 'Electronics', price: 199.99, quantity: 75 },
    { code: 'P4', name: 'Monitor', category: 'Electronics', price: 299.99, quantity: 30 },
    { code: 'P5', name: 'Keyboard', category: 'Electronics', price: 89.99, quantity: 120 }
])

const selectedProduct = ref()
</script>

<template>
    <Story title="DataTable">
        <Variant title="Basic">
            <DataTable :value="products" tableStyle="min-width: 50rem">
                <Column field="code" header="Code"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="category" header="Category"></Column>
                <Column field="price" header="Price"></Column>
                <Column field="quantity" header="Quantity"></Column>
            </DataTable>
            <div class="text-gray-300 mt-2">Basic table with fixed columns</div>
        </Variant>

        <Variant title="Selection">
            <DataTable 
                :value="products" 
                v-model:selection="selectedProduct" 
                selectionMode="single" 
                tableStyle="min-width: 50rem"
            >
                <Column field="code" header="Code"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="category" header="Category"></Column>
                <Column field="price" header="Price"></Column>
                <Column field="quantity" header="Quantity"></Column>
            </DataTable>
            <div class="text-gray-300 mt-2">Selected: {{ selectedProduct?.name || 'None' }}</div>
        </Variant>

        <Variant title="Striped">
            <DataTable :value="products" stripedRows tableStyle="min-width: 50rem">
                <Column field="code" header="Code"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="category" header="Category"></Column>
                <Column field="price" header="Price"></Column>
                <Column field="quantity" header="Quantity"></Column>
            </DataTable>
            <div class="text-gray-300 mt-2">Table with striped rows for better readability</div>
        </Variant>
    </Story>
</template> 