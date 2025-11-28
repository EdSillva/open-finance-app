<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-base-content">Dashboard Open Finance</h1>
        <p class="text-base-content/70 mt-1">Visão geral das métricas e estatísticas do ecossistema</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="badge badge-primary">Atualizado: {{ currentDate }}</div>
      </div>
    </div>

    <!-- Cards de estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard title="Total de Instituições" :value="stats.totalInstitutions" icon="🏦" color="primary"
        trend="+12%" />
      <StatsCard title="Serviços Ativos" :value="stats.activeServices" icon="⚙️" color="secondary" trend="+5%" />
      <StatsCard title="APIs Disponíveis" :value="stats.totalApis" icon="🔗" color="accent" trend="+8%" />
      <StatsCard title="Transações (mês)" :value="stats.monthlyTransactions" icon="💳" color="info" trend="+23%" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StatsCard from './StatsCard.vue'

const stats = ref({
  totalInstitutions: 347,
  activeServices: 1243,
  totalApis: 89,
  monthlyTransactions: '2.4M'
})

const currentDate = computed(() => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date())
})
</script>
