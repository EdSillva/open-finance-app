<template>
  <div class="space-y-6" :style="{ backgroundColor: 'var(--color-base-100)', color: 'var(--color-base-content)' }">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-base-content">
          Dashboard Open Finance
        </h1>
        <p class="text-base-content/70 mt-1">
          Visão geral das métricas e estatísticas do ecossistema
        </p>
      </div>
      <div class="flex items-center gap-2">
        <div class="badge badge-primary">
          Atualizado: {{ formatDateTime(new Date()) }}
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-lg">Mapa do Brasil - Clientes e Adesão</h2>
        <p class="text-sm text-base-content/60 mb-4">Passe o mouse sobre um estado para ver detalhes.</p>
        <div class="mt-2">
          <template v-if="dashboardStore.loading || estadosData.length === 0">
            <!-- Skeleton placeholder for map + sidebar while loading -->
            <div class="flex gap-4 items-start">
              <div class="flex-1 p-6 border rounded-lg bg-base-200 animate-pulse" style="min-height:320px">
                <div class="h-6 bg-base-300 rounded w-1/3 mb-4"></div>
                <div class="h-48 bg-base-300 rounded w-full"></div>
              </div>
              <div class="w-80 p-4 border rounded-lg bg-base-200 animate-pulse">
                <div class="h-6 bg-base-300 rounded w-3/4 mb-4"></div>
                <div class="space-y-3">
                  <div class="h-8 bg-base-300 rounded w-full"></div>
                  <div class="h-8 bg-base-300 rounded w-full"></div>
                  <div class="h-8 bg-base-300 rounded w-full"></div>
                  <div class="h-8 bg-base-300 rounded w-full"></div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <BrazilMap :data="estadosData" :selected="selected" @update:selected="onUpdateSelected" />
          </template>
        </div>
      </div>
    </div>

    <LoadingOverlay :loading="dashboardStore.loading" message="Carregando dados do parquet..." />

    <div v-if="dashboardStore.error" class="alert alert-error my-4">
      <div>
        <span>Erro ao carregar dados: {{ dashboardStore.error }}</span>
        <button class="btn btn-sm btn-ghost ml-4" @click="dashboardStore.fetchDashboardData()">Tentar novamente</button>
      </div>
    </div>

    <div class="space-y-6">
      <DemographicCharts />
      <FinancialCharts />
      <DigitalBehaviorChart />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { formatDateTime } from '@/helpers/date'
import { useDashboardStore } from '@/stores/dashboard'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import BrazilMap from '@/components/BrazilMap.vue'
import DemographicCharts from '@/components/charts/DemographicCharts.vue'
import FinancialCharts from '@/components/charts/FinancialCharts.vue'
import DigitalBehaviorChart from '@/components/charts/DigitalBehaviorChart.vue'

const dashboardStore = useDashboardStore()

const { estadosData } = dashboardStore

const selected = ref<string[]>([])

function onUpdateSelected(v: string[]) {
  selected.value = v || []
}

onMounted(async () => {
  await dashboardStore.fetchDashboardData()
})
</script>
