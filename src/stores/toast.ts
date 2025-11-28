import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString()
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    }

    toasts.value.push(newToast)

    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  const showSuccess = (message: string, duration?: number) => {
    addToast({ message, type: 'success', duration })
  }

  const showError = (message: string, duration?: number) => {
    addToast({ message, type: 'error', duration })
  }

  const showWarning = (message: string, duration?: number) => {
    addToast({ message, type: 'warning', duration })
  }

  const showInfo = (message: string, duration?: number) => {
    addToast({ message, type: 'info', duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
})
