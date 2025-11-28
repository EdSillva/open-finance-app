<template>
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-base-100 rounded-lg p-6 flex items-center gap-4">
            <span class="loading loading-spinner loading-lg"></span>
            <span class="text-lg">{{ message }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    loading: boolean
    message?: string
}

withDefaults(defineProps<Props>(), {
    message: 'Carregando...'
})
</script>
