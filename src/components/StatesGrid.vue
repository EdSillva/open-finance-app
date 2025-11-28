<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h3 :class="props.compact ? 'text-sm font-semibold' : 'text-lg font-semibold'">Estados</h3>
      <div class="flex gap-2">
        <button class="btn btn-sm text-[--color-primary]" @click="clearSelection">Limpar</button>
        <button class="btn btn-sm btn-outline" @click="selectAll">Selecionar todos</button>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <div v-for="item in visibleData" :key="item.Estado"
        class="card p-2 cursor-pointer transition-transform hover:scale-[1.02]"
        :class="{ 'ring-2 ring-offset-2': isSelected(item.Estado) }"
        :style="[cardStyle(item.count, isSelected(item.Estado)), { minHeight: props.compact ? '48px' : '72px' }]"
        @click="toggle(item.Estado)">
        <div class="flex justify-between items-start">
          <div>
            <div
              :class="props.compact ? 'text-xs font-medium text-base-content' : 'text-sm font-medium text-base-content'">
              {{ item.Estado }}</div>
            <div v-if="!props.compact" class="text-xs text-base-content/70">Clientes: {{ item.count }}</div>
          </div>
          <div class="text-right">
            <div
              :class="props.compact ? 'text-xs font-semibold text-base-content' : 'text-sm font-semibold text-base-content'">
              {{ percent(item) }}</div>
            <div v-if="!props.compact" class="text-xs text-base-content/60">adesão</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface EstadoData {
  Estado: string
  count: number
  aderiu?: number
  nao_aderiu?: number
}

const props = defineProps<{ data: EstadoData[]; selected?: string[]; compact?: boolean }>()
const emit = defineEmits<{
  (e: 'update:selected', value: string[]): void
}>()

const selected = ref<Set<string>>(new Set(props.selected || []))

watch(
  () => props.selected,
  (v) => {
    selected.value = new Set(v || [])
  }
)

const sortedData = computed(() => [...props.data].sort((a, b) => b.count - a.count))

const normalizeForCompare = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

const visibleData = computed(() => sortedData.value.filter(item => normalizeForCompare(item.Estado) !== 'nao informado'))

function toggle(estado: string) {
  if (selected.value.has(estado)) selected.value.delete(estado)
  else selected.value.add(estado)
  emit('update:selected', Array.from(selected.value))
}

function isSelected(estado: string) {
  return selected.value.has(estado)
}

function clearSelection() {
  selected.value.clear()
  emit('update:selected', [])
}

function selectAll() {
  visibleData.value.forEach((d) => selected.value.add(d.Estado))
  emit('update:selected', Array.from(selected.value))
}

function percent(item: EstadoData) {
  const total = item.aderiu != null ? (item.aderiu + (item.nao_aderiu || 0)) : item.count
  if (!total) return '0%'
  const rate = item.aderiu ? Math.round((item.aderiu / total) * 100) : 0
  return `${rate}%`
}

function cardStyle(count: number, active: boolean) {
  const s = getComputedStyle(document.documentElement)
  const primary = (s.getPropertyValue('--bb-blue-700') || s.getPropertyValue('--color-primary') || '#2b6cb0').trim()
  const max = Math.max(...props.data.map(d => d.count || 0), 1)
  if (active) {
    return {
      background: primary.startsWith('#') ? primary : primary,
      border: `2px solid var(--bb-yellow-500)`,
      color: 'var(--color-base-100)'
    }
  }

  const intensity = Math.max(0.08, Math.min(0.9, (count / max) * 0.9))
  const bg = primary.startsWith('#') ? hexToRgba(primary, intensity) : rgbaFromCss(primary, intensity)
  const border = '1px solid rgba(0,0,0,0.06)'
  return {
    background: bg,
    border: border,
    color: 'var(--color-base-content)'
  }
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
  const vals = css.replace(/rgba?\(|\)|\s/g, '').split(',')
  if (vals.length >= 3) return `rgba(${vals[0]}, ${vals[1]}, ${vals[2]}, ${a})`
  return css
}
</script>

<style scoped>
.card {
  min-height: 72px;
}
</style>
