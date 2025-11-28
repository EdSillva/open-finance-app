<template>
  <div class="w-full h-80">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface EstadoData {
  Estado: string
  count: number
  aderiu?: number
  nao_aderiu?: number
}

interface Props {
  data: EstadoData[]
}

const props = defineProps<Props>()

const chartData = computed(() => {
  const estados = props.data.map(item => item.Estado)
  const totais = props.data.map(item => item.count)
  const aderiram = props.data.map(item => item.aderiu || 0)
  const naoAderiram = props.data.map(item => item.nao_aderiu || 0)

  const s = getComputedStyle(document.documentElement)
  const primary = s.getPropertyValue('--color-secondary').trim() || 'rgba(59,130,246,1)'
  const primaryRgb = primary.startsWith('#') ? hexToRgba(primary, 0.8) : rgbaFromCss(primary, 0.8)
  const success = s.getPropertyValue('--color-success').trim() || 'rgba(34,197,94,1)'
  const successRgb = success.startsWith('#') ? hexToRgba(success, 0.8) : rgbaFromCss(success, 0.8)
  const error = s.getPropertyValue('--color-error').trim() || 'rgba(239,68,68,1)'
  const errorRgb = error.startsWith('#') ? hexToRgba(error, 0.8) : rgbaFromCss(error, 0.8)

  return {
    labels: estados,
    datasets: [
      {
        label: 'Total de Clientes',
        data: totais,
        backgroundColor: primaryRgb,
        borderColor: primary.trim() || 'rgba(59,130,246,1)',
        borderWidth: 2,
      },
      {
        label: 'Aderiu ao OPF',
        data: aderiram,
        backgroundColor: successRgb,
        borderColor: success.trim() || 'rgba(34,197,94,1)',
        borderWidth: 2,
      },
      {
        label: 'Não Aderiu',
        data: naoAderiram,
        backgroundColor: errorRgb,
        borderColor: error.trim() || 'rgba(239,68,68,1)',
        borderWidth: 2,
      },
    ],
  }
})

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--color-base-content') || 'rgb(148,163,184)',
        font: {
          size: 12,
        },
        padding: 15,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.dataset.label || ''
          const value = context.parsed.y || 0
          return `${label}: ${value.toLocaleString('pt-BR')}`
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--color-base-content') || 'rgb(148,163,184)',
        font: {
          size: 11,
        },
      },
      grid: {
        color: (getComputedStyle(document.documentElement).getPropertyValue('--color-base-content') || 'rgba(148,163,184)') + '1a',
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--color-base-content') || 'rgb(148,163,184)',
        font: {
          size: 11,
        },
      },
      grid: {
        color: (getComputedStyle(document.documentElement).getPropertyValue('--color-base-content') || 'rgb(148,163,184)') + '1a',
      },
    },
  },
}

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
</script>
