<template>
    <div class="toast toast-top toast-end">
        <div v-for="toast in toasts" :key="toast.id" class="alert" :class="getAlertClass(toast.type)">
            <div>
                <span>{{ toast.message }}</span>
            </div>
            <div class="flex-none">
                <button class="btn btn-sm btn-ghost" @click="removeToast(toast.id)">
                    ✕
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
const { toasts, removeToast } = toastStore

const getAlertClass = (type: string) => {
    switch (type) {
        case 'success': return 'alert-success'
        case 'error': return 'alert-error'
        case 'warning': return 'alert-warning'
        case 'info': return 'alert-info'
        default: return 'alert-info'
    }
}
</script>
