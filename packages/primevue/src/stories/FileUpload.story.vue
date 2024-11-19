<script setup lang="ts">
import FileUpload from 'primevue/fileupload'
import Button from 'primevue/button'

const onUpload = () => {
    // Handle upload
}

const onSelect = () => {
    // Handle select
}
</script>

<template>
    <Story title="FileUpload">
        <Variant title="Basic">
            <FileUpload 
                mode="basic" 
                name="file" 
                url="/api/upload"
                @upload="onUpload" 
                :auto="true"
            />
        </Variant>

        <Variant title="Advanced">
            <FileUpload 
                name="files" 
                url="/api/upload" 
                @upload="onUpload"
                @select="onSelect"
                :multiple="true"
                accept="image/*"
                :maxFileSize="1000000"
            >
                <template #header="{ chooseCallback }">
                    <div class="flex flex-wrap gap-2 justify-content-between align-items-center">
                        <div class="flex gap-2">
                            <Button @click="chooseCallback" icon="fa-solid fa-plus" label="Choose" />
                            <Button icon="fa-solid fa-upload" label="Upload" severity="success" />
                            <Button icon="fa-solid fa-times" label="Cancel" severity="danger" />
                        </div>
                    </div>
                </template>
                <template #empty>
                    <div class="flex flex-col items-center justify-center p-8">
                        <i class="fa-solid fa-cloud-upload text-4xl mb-4 text-surface-300"></i>
                        <span class="text-surface-300">Drag and drop files here to upload</span>
                    </div>
                </template>
            </FileUpload>
        </Variant>

        <Variant title="Disabled">
            <FileUpload 
                mode="basic" 
                name="file" 
                url="/api/upload"
                disabled
            />
        </Variant>
    </Story>
</template> 