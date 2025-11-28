<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>

    <!-- Modal -->
    <div class="relative bg-base-100 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <button class="btn btn-sm btn-ghost btn-circle" @click="closeModal">
          ✕
        </button>
      </div>

      <div class="mb-6">
        <slot />
      </div>

      <div class="flex justify-end gap-2">
        <button v-if="showCancel" class="btn btn-ghost" @click="closeModal">
          {{ cancelText }}
        </button>
        <button class="btn btn-primary" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  showCancel: true
})

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const closeModal = () => {
  emit('close')
}
</script>
