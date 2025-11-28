<template>
  <div class="space-y-6">
    <h3 class="text-lg font-semibold">Gráfico de perfil financeiro</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div class="card bg-base-200 p-4">
        <h4 class="font-medium mb-2">Adesão por Grupo de Renda</h4>
        <canvas ref="rendaChart"></canvas>
      </div>

      <div class="card bg-base-200 p-4">
        <h4 class="font-medium mb-2">Adesão por Grupo de score de crédito</h4>
        <canvas ref="scoreChart"></canvas>
      </div>

      <div class="card bg-base-200 p-4 md:col-span-2">
        <h4 class="font-medium mb-2">Adesão por Grupo de gasto mensal</h4>
        <canvas ref="gastoChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Chart from 'chart.js/auto'
import { apiService } from '@/services/api'

const rendaChart = ref<HTMLCanvasElement | null>(null)
const scoreChart = ref<HTMLCanvasElement | null>(null)
const gastoChart = ref<HTMLCanvasElement | null>(null)

let charts: any[] = []

function normalizeAdesao(v: any) {
  if (v === null || v === undefined) return 'Não informado'
  const s = String(v).toLowerCase()
  if (s === 'sim' || s === 'aderiu' || s === '1' || s === 'true') return 'Aderiu'
  if (s === 'nao' || s === 'não' || s === 'nao_aderiu' || s === '0' || s === 'false') return 'Não aderiu'
  return String(v)
}

function buildCountChart(canvas: HTMLCanvasElement, data: any[], column: string) {
  const groups = new Map<string, Record<string, number>>()
  const adesaoSet = new Set<string>()

  data.forEach((row: any) => {
    const key = row[column] ?? 'Não informado'
    const adesao = normalizeAdesao(row.Adhesao_ao_OPF ?? row.Adesao_ao_OPF)
    adesaoSet.add(adesao)
    const k = String(key)
    if (!groups.has(k)) groups.set(k, {})
    const obj = groups.get(k) as Record<string, number>
    obj[adesao] = (obj[adesao] || 0) + 1
  })

  const labels = Array.from(groups.keys()).filter((lbl) => {
    const obj = groups.get(lbl) as Record<string, number> | undefined
    if (!obj) return false
    const total = Object.values(obj).reduce((s, v) => s + (Number(v) || 0), 0)
    return total > 0
  })
  const adesaoVals = Array.from(adesaoSet)
  const palette = ['#1f77b4', '#ffcc00']

  const datasets = adesaoVals.map((a, idx) => ({
    label: a,
    data: labels.map((l) => Number(groups.get(l)?.[a] || 0)),
    backgroundColor: palette[idx % palette.length],
  }))

  const chart = new Chart(canvas.getContext('2d') as CanvasRenderingContext2D, {
    type: 'bar',
    data: { labels, datasets },
    options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } },
  })

  return chart
}

onMounted(async () => {
  try {
    const resp = await apiService.getClientsData(5000, 0)
    const raw = resp.data || []
    const data = raw.map((r: any) => {
      return {
        ...r,
        'Gp renda': r['Gp renda'] ?? r['Gp_renda'] ?? r['gp_renda'] ?? null,
        'Gp gasto mensal': r['Gp gasto mensal'] ?? r['Gp_gasto_mensal'] ?? r['gp_gasto_mensal'] ?? null,
        'Gp score de crédito': r['Gp score de crédito'] ?? r['Gp_score_de_crédito'] ?? r['gp_score_de_credito'] ?? null,
        'Renda': (r['Renda'] ?? r['renda'] ?? null)
      }
    })

    console.debug('FinancialCharts sample rows:', JSON.stringify(data.slice(0, 3)))

    if (rendaChart.value) charts.push(buildCountChart(rendaChart.value, data, 'Gp renda'))
    if (scoreChart.value) charts.push(buildCountChart(scoreChart.value, data, 'Gp score de crédito'))
    if (gastoChart.value) charts.push(buildCountChart(gastoChart.value, data, 'Gp gasto mensal'))
  } catch (err) {
    console.error('Erro ao carregar dados para gráficos financeiros', err)
  }
})

onBeforeUnmount(() => {
  charts.forEach((c) => c.destroy())
  charts = []
})
</script>

<style scoped>
.card {
  border-radius: .5rem
}
</style>
