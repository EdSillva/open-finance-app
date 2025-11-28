<template>
  <div v-if="result" class="card bg-base-200 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-4">📊 Resultado da Predição</h2>

      <!-- Resultado Principal -->
      <div class="alert" :class="{
        'alert-success': result.prediction === 1,
        'alert-warning': result.prediction === 0
      }">
        <div>
          <h3 class="font-bold text-lg">{{ result.label }}</h3>
          <p class="text-sm mt-1">
            Probabilidade de adesão:
            <span class="font-bold">{{ ((result.probability?.[1] ?? 0) * 100).toFixed(1) }}%</span>
          </p>
        </div>
      </div>

      <!-- Probabilidades -->
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div class="stat bg-base-300 rounded-lg">
          <div class="stat-title">Não Aderir</div>
          <div class="stat-value text-2xl">{{ ((result.probability?.[0] ?? 0) * 100).toFixed(1) }}%</div>
          <div class="stat-desc">Classe 0</div>
        </div>

        <div class="stat bg-base-300 rounded-lg">
          <div class="stat-title">Aderir</div>
          <div class="stat-value text-2xl text-primary">{{ ((result.probability?.[1] ?? 0) * 100).toFixed(1) }}%</div>
          <div class="stat-desc">Classe 1</div>
        </div>
      </div>

      <!-- Importância das Features (Top 5) -->
      <div class="mt-6">
        <h3 class="text-lg font-bold mb-3">🎯 Features Mais Importantes</h3>
        <div class="space-y-2">
          <div v-for="(feature, index) in topFeatures" :key="feature.name" class="flex items-center gap-3">
            <div class="badge badge-primary">{{ index + 1 }}</div>
            <div class="flex-1">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium">{{ formatFeatureName(feature.name) }}</span>
                <span class="text-sm text-base-content/70">{{ (feature.importance * 100).toFixed(1) }}%</span>
              </div>
              <progress class="progress progress-primary w-full" :value="feature.importance * 100" max="100"></progress>
            </div>
          </div>
        </div>
      </div>

      <!-- Botão Nova Predição -->
      <div class="card-actions justify-end mt-6">
        <button @click="$emit('reset')" class="btn btn-primary">
          Nova Predição
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PredictionResponse } from '@/services/api'

const props = defineProps<{
  result: PredictionResponse | null
}>()

defineEmits<{
  reset: []
}>()

const topFeatures = computed(() => {
  if (!props.result) return []

  const importances = props.result.global_feature_importances

  if (Array.isArray(importances)) {
    return importances
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5)
      .map(item => ({
        name: item.feature,
        importance: item.importance / 100
      }))
  } else {
    return Object.entries(importances)
      .map(([name, importance]) => ({ name, importance }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5)
  }
})

const formatFeatureName = (name: string): string => {
  const map: Record<string, string> = {
    // Campos categóricos indexados
    'Faixa etária_idx': 'Faixa Etária',
    'Estado_idx': 'Estado',
    'Sexo_idx': 'Sexo',
    'Ocupacao_idx': 'Ocupação',
    'Escolaridade_idx': 'Escolaridade',
    'Gp renda_idx': 'Grupo de Renda',
    'Tipo_da_conta_idx': 'Tipo de Conta',
    'Gp score de crédito_idx': 'Score de Crédito',
    'Gp limite do cartão_idx': 'Limite do Cartão',
    'Tempo_conta_atv_idx': 'Tempo de Conta Ativa',

    // Campos numéricos binários
    'Outros_bancos': 'Possui Outros Bancos',
    'Emprestimo': 'Possui Empréstimo',
    'Financiamento': 'Possui Financiamento',
    'Cartao_de_credito': 'Cartão de Crédito',
    'Usa_cheque': 'Usa Cheque',
    'Atrasa_pag': 'Atrasa Pagamentos',
    'Investimentos': 'Possui Investimentos',
    'Usa_pix': 'Usa PIX',
    'Usa_eBanking': 'Usa Internet Banking',
    'Usa_app_banco': 'Usa App do Banco',
  }

  return map[name] || name
}
</script>
