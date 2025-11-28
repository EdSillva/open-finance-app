<template>
  <div class="w-full h-64">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  aderiu: number
  naoAderiu: number
}

const props = defineProps<Props>()

const chartData = computed(() => {
  const s = getComputedStyle(document.documentElement)
  const success = s.getPropertyValue('--color-success').trim() || 'rgba(34,197,94,1)'
  const error = s.getPropertyValue('--color-error').trim() || 'rgba(239,68,68,1)'

  const successRgb = success.startsWith('#') ? hexToRgba(success, 0.8) : rgbaFromCss(success, 0.8)
  const errorRgb = error.startsWith('#') ? hexToRgba(error, 0.8) : rgbaFromCss(error, 0.8)

  return ({
    labels: ['Aderiu ao OPF', 'Não Aderiu'],
    datasets: [
      {
        label: 'Clientes',
        data: [props.aderiu, props.naoAderiu],
        backgroundColor: [successRgb, errorRgb],
        borderColor: [
          success.trim() || 'rgba(34,197,94,1)',
          error.trim() || 'rgba(239,68,68,1)',
        ],
        borderWidth: 2,
      },
    ],
  })
})

function hexToRgba(hex: string, a = 1) {
  const sanitized = hex.replace('#', '')
  const bigint = parseInt(sanitized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function rgbaFromCss(css: string, a = 1) {
  const vals = css.replace(/rgba?|\(|\)|\s/g, '').split(',')
  if (vals.length >= 3) return `rgba(${vals[0]}, ${vals[1]}, ${vals[2]}, ${a})`
  return css
}

const chartOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'rgb(148, 163, 184)',
        font: {
          size: 12,
        },
        padding: 15,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || ''
          const value = context.parsed || 0
          const total = props.aderiu + props.naoAderiu
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${value.toLocaleString('pt-BR')} (${percentage}%)`
        },
      },
    },
  },
}
</script>
