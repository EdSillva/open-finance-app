<template>
  <div class="space-y-6" :style="{ backgroundColor: 'var(--color-base-100)', color: 'var(--color-base-content)' }">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-base-content">Predição de Adesão</h1>
      <p class="text-base-content/70 mt-1">
        Use o modelo de ML para prever a probabilidade de adesão ao Open Finance
      </p>
    </div>

    <!-- Status da API -->
    <div class="alert" :class="{
      'alert-success': apiStatus,
      'alert-error': !apiStatus
    }">
      <div>
        <span class="font-bold">Status da API:</span>
        <span class="ml-2">{{ apiStatus ? '🟢 Online' : '🔴 Offline' }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Formulário -->
      <PredictionForm :loading="loading" @submit="handlePrediction" />

      <!-- Resultado -->
      <PredictionResult :result="predictionResult" @reset="resetPrediction" />
    </div>

    <LoadingOverlay :loading="loading" message="Processando predição..." />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiService } from '@/services/api'
import type { PredictionRequest, PredictionResponse } from '@/services/api'
import PredictionForm from '@/components/form/PredictionForm.vue'
import PredictionResult from '@/components/form/PredictionResult.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
const loading = ref(false)
const apiStatus = ref(false)
const predictionResult = ref<PredictionResponse | null>(null)

onMounted(async () => {
  apiStatus.value = await apiService.healthCheck()
  if (!apiStatus.value) {
    toastStore.showWarning('Aviso: API offline. Verifique se o servidor está rodando.')
  }
})

const handlePrediction = async (data: PredictionRequest) => {
  loading.value = true
  predictionResult.value = null

  try {
    const result = await apiService.predict(data)
    predictionResult.value = result
    toastStore.showSuccess('Predição realizada com sucesso!')
  } catch (error) {
    console.error('Erro ao fazer predição:', error)
    toastStore.showError('Erro ao fazer predição. Verifique se a API está rodando.')
  } finally {
    loading.value = false
  }
}

const resetPrediction = () => {
  predictionResult.value = null
}
</script>
