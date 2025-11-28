<template>
  <div class="space-y-6">
    <h3 class="text-lg font-semibold">Gráfico de comportamento digital do cliente</h3>
    <div class="card bg-base-200 p-4">
      <canvas ref="digitalChart"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Chart from 'chart.js/auto'
import { apiService } from '@/services/api'

const digitalChart = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

function normalizeAdesao(v: any) {
  if (v === null || v === undefined) return 'Não informado'
  const s = String(v).toLowerCase()
  if (s === 'sim' || s === 'aderiu' || s === '1' || s === 'true') return 'Aderiu'
  if (s === 'nao' || s === 'não' || s === 'nao_aderiu' || s === '0' || s === 'false') return 'Não aderiu'
  return String(v)
}

onMounted(async () => {
  try {
    const resp = await apiService.getClientsData(5000, 0)
    const df = resp.data || []

    const digitalCols = ['Usa_pix', 'Usa_eBanking', 'Usa_app_banco', 'Usa_cheque']

    const grouped: Record<string, Record<string, number>> = {}

    df.forEach((row: any) => {
      const adesao = normalizeAdesao(row.Adhesao_ao_OPF ?? row.Adesao_ao_OPF)
      const obj = grouped[adesao] || (grouped[adesao] = {} as Record<string, number>)
      digitalCols.forEach((col) => {
        obj[col] = (obj[col] || 0) + Number(Boolean(row[col]))
      })
    })

    const totals: Record<string, number> = {}
    digitalCols.forEach((c) => { totals[c] = 0 })
    Object.keys(grouped).forEach((k) => {
      const obj = grouped[k] as Record<string, number> | undefined
      if (!obj) return
      digitalCols.forEach((c) => {
        totals[c] = (totals[c] || 0) + Number((obj[c] ?? 0) as number)
      })
    })

    const visibleCols = digitalCols.filter((c) => (totals[c] || 0) > 0)
    const labels = visibleCols.map((c) => c.replace(/^Usa_/, '').replace(/_/g, ' '))
    const adesaoKeys = Object.keys(grouped)
    const datasets = adesaoKeys.map((k, idx) => {
      const obj = grouped[k] as Record<string, number> | undefined
      return {
        label: k,
        data: labels.map((_, i) => (obj && obj[String(visibleCols[i])] ? obj[String(visibleCols[i])] : 0)),
        backgroundColor: ['#1f77b4', '#ffcc00'][idx % 2],
      }
    })

    if (digitalChart.value) {
      const ctx = digitalChart.value.getContext('2d') as CanvasRenderingContext2D
      chart = new (Chart as any)(ctx, { type: 'bar', data: { labels, datasets }, options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { x: { stacked: false }, y: { beginAtZero: true } } } } as any)
    }
  } catch (err) {
    console.error('Erro ao carregar dados para comportamento digital', err)
  }
})

onBeforeUnmount(() => {
  chart?.destroy()
})
</script>

<style scoped>
.card {
  border-radius: .5rem
}
</style>
