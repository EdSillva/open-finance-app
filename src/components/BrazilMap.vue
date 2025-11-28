<template>
  <div class="map-wrap">
    <div class="map-stage flex gap-4 items-start">
      <div class="map-area flex-1 relative">
        <div v-if="svgContent" class="svg-container" v-html="svgContent"></div>

        <svg v-else viewBox="140 80 220 320" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
          <g v-for="s in shapes" :key="s.id">
            <path :d="s.d" :class="['state-path', { 'state-active': isSelected(s.name) }]"
              :style="{ fill: fillFor(s.name) }" @click="onClickState(s.name)" />
            <template v-if="getLabel(s.name)">
              <text :x="getLabel(s.name)!.x" :y="getLabel(s.name)!.y" class="map-label">{{ getLabel(s.name)!.text
              }}</text>
            </template>
          </g>
        </svg>

        <!-- tooltip -->
        <div v-show="tooltip.visible" :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }" class="map-tooltip">
          <div class="tooltip-title">{{ tooltip.title }}</div>
          <div class="tooltip-row">Clientes: <span class="tooltip-value-primary">{{ tooltip.count }}</span></div>
          <div class="tooltip-row">Adesão: <span class="tooltip-value-primary">{{ tooltip.adesao }}</span></div>
          <div class="tooltip-row">Aderiu: <span class="tooltip-value-primary">{{ tooltip.aderiu }}</span></div>
          <div class="tooltip-row">Não Aderiu: <span class="tooltip-value-primary">{{ tooltip.nao_aderiu }}</span></div>
        </div>
      </div>

      <div class="map-sidebar w-80">
        <StatesGrid :data="props.data" :selected="selectedArray" @update:selected="onSidebarSelected" compact />
      </div>
    </div>

    <div class="legend mt-2">
      <div class="legend-title">Área/Clientes</div>
      <div class="legend-scale">
        <div class="legend-color" v-for="(c, i) in legendColors" :key="i" :style="{ background: c }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import shapesData from '@/assets/data/brazil-states-paths.json'
import brSvg from '@/assets/image/br.svg?raw'
import stateIdMap from '@/assets/data/stateIdMap.json'
import StatesGrid from '@/components/StatesGrid.vue'
import { ref, computed, watch, onMounted, nextTick } from 'vue'

interface EstadoData {
  Estado: string
  count: number
  aderiu?: number
  nao_aderiu?: number
}

const props = defineProps<{ data: EstadoData[]; selected?: string[] }>()
const emit = defineEmits<{
  (e: 'update:selected', value: string[]): void
}>()

const shapesList = shapesData as Array<{ id: string; name: string; d: string }>

const selected = ref<Set<string>>(new Set(props.selected || []))

const selectedArray = computed(() => Array.from(selected.value))

function onSidebarSelected(v: string[]) {
  selected.value = new Set(v || [])
  emit('update:selected', Array.from(selected.value))
  updateSvgFills()
  updateSvgSelection()
}
// normalize helper for comparing state names (remove diacritics, lowercase)
const normalizeForCompare = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
type TooltipState = { visible: boolean; x: number; y: number; title: string; value: string; count: string; adesao: string; aderiu: string; nao_aderiu: string }
const tooltip = ref<TooltipState>({ visible: false, x: 0, y: 0, title: '', value: '', count: '', adesao: '', aderiu: '', nao_aderiu: '' })
const activeRange = ref<number | null>(null)

watch(
  () => props.selected,
  (v) => {
    selected.value = new Set(v || [])
    // reflect selection visually in injected SVG
    updateSvgSelection()
  }
)

watch(
  () => props.data,
  () => {
    // data changed -> update fills
    updateSvgFills()
    // also recompute ranges
    computeRanges()
  },
  { deep: true }
)

function onClickState(name: string) {
  if (selected.value.has(name)) selected.value.delete(name)
  else selected.value.add(name)
  emit('update:selected', Array.from(selected.value))
}

function showTooltip(name: string, ev?: MouseEvent) {
  const v = valueFor(name)
  // find matching record robustly using normalized keys
  const key = normalizeForCompare(name)
  let full = props.data.find(d => normalizeForCompare(d.Estado || '') === key)
  // prefer lookup that handles UF codes and full names like the cards
  full = getDataByName(name) || full
  tooltip.value.title = name
  tooltip.value.value = v.toLocaleString('pt-BR')
  tooltip.value.count = full ? (full.count || 0).toLocaleString('pt-BR') : '—'
  tooltip.value.aderiu = full ? (full.aderiu || 0).toLocaleString('pt-BR') : '—'
  tooltip.value.nao_aderiu = full ? (full.nao_aderiu || 0).toLocaleString('pt-BR') : '—'
  // adesao percent similar to StatesGrid.percent
  if (full) {
    const total = full.aderiu != null ? (full.aderiu + (full.nao_aderiu || 0)) : full.count
    const rate = total ? Math.round(((full.aderiu || 0) / total) * 100) : 0
    tooltip.value.adesao = `${rate}%`
  } else {
    tooltip.value.adesao = '—'
  }
  tooltip.value.visible = true
  if (ev) {
    tooltip.value.x = ev.clientX + 12
    tooltip.value.y = ev.clientY + 12
  }
}

function moveTooltip(ev: MouseEvent) {
  tooltip.value.x = ev.clientX + 12
  tooltip.value.y = ev.clientY + 12
}

function hideTooltip() {
  tooltip.value.visible = false
}

function isSelected(name: string) {
  return isStateSelected(name)
}

function isStateSelected(name: string) {
  if (!name) return false
  const keyNorm = normalizeForCompare(name)
  // direct match (exact string in selected set)
  for (const s of Array.from(selected.value)) {
    if (!s) continue
    if (s === name) return true
    // UF match (selected might be 'SP' while name is 'São Paulo')
    if (s.length === 2 && (ufToName[s.toUpperCase()] === name || normalizeForCompare(ufToName[s.toUpperCase()] || '') === keyNorm)) return true
    // normalized name match
    if (normalizeForCompare(s) === keyNorm) return true
    // also try mapping name -> UF then compare
    const mappedUf = nameToUf[s]
    if (mappedUf && mappedUf === (nameToUf[name] || '')) return true
  }
  // fallback: if selected contains UF matching this name's mapped UF
  const myUf = nameToUf[name]
  if (myUf) {
    for (const s of Array.from(selected.value)) {
      if (!s) continue
      if (s.toUpperCase() === myUf) return true
    }
  }
  return false
}

const maxVal = computed(() => Math.max(...props.data.map(d => d.count || 0), 1))

function valueFor(name: string) {
  const found = getDataByName(name)
  return found ? found.count || 0 : 0
}

function percent(item: EstadoData) {
  const total = item.aderiu != null ? (item.aderiu + (item.nao_aderiu || 0)) : item.count
  if (!total) return '0%'
  const rate = item.aderiu ? Math.round((item.aderiu / total) * 100) : 0
  return `${rate}%`
}

// Build quick lookup maps between UF codes and full names from stateIdMap
const ufToName: Record<string, string> = {}
const nameToUf: Record<string, string> = {}
Object.keys(stateIdMap).forEach((k) => {
  const uf = k.replace(/^BR/i, '')
  const entry = (stateIdMap as Record<string, any>)[k]
  if (uf && entry && entry.name) {
    ufToName[uf.toUpperCase()] = entry.name
    nameToUf[entry.name] = uf.toUpperCase()
  }
})

function getDataByName(name: string): EstadoData | undefined {
  if (!name) return undefined
  const raw = name.trim()
  // 1) direct UF code match (e.g., 'SP', 'PB')
  const asUf = raw.toUpperCase()
  const byUf = props.data.find(d => (d.Estado || '').toUpperCase() === asUf)
  if (byUf) return byUf

  // 2) if name is full name, try map to UF then match
  const mappedUf = nameToUf[raw]
  if (mappedUf) {
    const fromMap = props.data.find(d => (d.Estado || '').toUpperCase() === mappedUf)
    if (fromMap) return fromMap
  }

  // 3) try normalized compare between full names
  const key = normalizeForCompare(raw)
  const byNormalized = props.data.find(d => normalizeForCompare(d.Estado || '') === key || normalizeForCompare(ufToName[((d.Estado || '').toUpperCase())] || '') === key)
  if (byNormalized) return byNormalized

  return undefined
}

function fillFor(name: string) {
  const v = valueFor(name)
  if (!v) return 'var(--color-base-100)'
  const pct = v / (maxVal.value || 1)
  const start = getComputedStyle(document.documentElement).getPropertyValue('--color-base-200') || '#eef1f6'
  const highlight = getComputedStyle(document.documentElement).getPropertyValue('--bb-blue-900') || '#102b57'
  return shadeColorMix(start.trim(), highlight.trim(), pct)
}

function shadeColorMix(a: string, b: string, t: number) {
  const ac = hexToRgb(a) || { r: 238, g: 241, b: 246 }
  const bc = hexToRgb(b) || { r: 16, g: 43, b: 87 }
  const r = Math.round(ac.r + (bc.r - ac.r) * t)
  const g = Math.round(ac.g + (bc.g - ac.g) * t)
  const bl = Math.round(ac.b + (bc.b - ac.b) * t)
  return `rgb(${r}, ${g}, ${bl})`
}

function hexToRgb(hex: string) {
  const h = (hex || '').replace('#', '').trim()
  if (!h) return { r: 238, g: 241, b: 246 }
  if (h.length === 3) {
    const r = parseInt(h.charAt(0) + h.charAt(0), 16)
    const g = parseInt(h.charAt(1) + h.charAt(1), 16)
    const b = parseInt(h.charAt(2) + h.charAt(2), 16)
    return { r, g, b }
  }
  if (h.length === 6) {
    const r = parseInt(h.substring(0, 2), 16)
    const g = parseInt(h.substring(2, 4), 16)
    const b = parseInt(h.substring(4, 6), 16)
    return { r, g, b }
  }
  return { r: 238, g: 241, b: 246 }
}

function labelFor(name: string) {
  // try to find an entry in stateIdMap by matching name
  const map = stateIdMap as Record<string, { name: string; cx?: number; cy?: number }>
  for (const k of Object.keys(map)) {
    const entry = map[k]
    if (!entry) continue
    if (entry.name === name) {
      return entry
    }
  }
  return null
}

function getLabel(name: string) {
  const info = labelFor(name)
  if (!info || typeof info.cx !== 'number' || typeof info.cy !== 'number') return null
  return { x: info.cx, y: info.cy, text: valueFor(info.name).toLocaleString('pt-BR') }
}

const shapes = shapesList

const svgContent = ref<string | null>(null)

onMounted(async () => {
  try {
    if (brSvg && typeof brSvg === 'string') {
      svgContent.value = brSvg
      await nextTick()
      const container = document.querySelector('.svg-container') as HTMLElement | null
      if (container) {
        const paths = container.querySelectorAll('path[id], path[name]')
        paths.forEach((p) => {
          const el = p as SVGPathElement
          const id = el.getAttribute('id') || ''
          const nameAttr = el.getAttribute('name')
          // Map id to friendly name when `name` attribute missing
          // abbreviation fallback: BR + UF (e.g. BRRS -> RS)
          let friendly = ''
          if (nameAttr) friendly = nameAttr
          else if (id) {
            const m = id.match(/^BR([A-Z]{2})$/i)
            if (m && m[1]) {
              const key = id.toUpperCase()
              const entry = (stateIdMap as Record<string, any>)[key]
              friendly = entry ? entry.name : id
            } else friendly = id
          }
          el.style.cursor = 'pointer'
          el.addEventListener('click', (ev) => {
            onClickState(friendly)
            ev.stopPropagation()
          })
          el.addEventListener('mouseenter', (ev) => showTooltip(friendly, ev as MouseEvent))
          el.addEventListener('mousemove', (ev) => moveTooltip(ev as MouseEvent))
          el.addEventListener('mouseleave', () => hideTooltip())
          const primaryCss = getComputedStyle(document.documentElement).getPropertyValue('--bb-blue-700') || getComputedStyle(document.documentElement).getPropertyValue('--color-primary') || '#2b6cb0'
          const primary = primaryCss.trim() || '#2b6cb0'
          el.style.fill = isStateSelected(friendly) ? primary : fillFor(friendly)
        })
        // initial compute of ranges
        computeRanges()
        // ensure fills and labels reflect initial selection/data
        updateSvgFills()
      }
    }
  } catch (err) {
    console.warn('Failed to initialize SVG map:', err)
    svgContent.value = null
  }
})

function updateSvgSelection() {
  // update classes for paths in injected SVG according to `selected`
  const container = document.querySelector('.svg-container') as HTMLElement | null
  if (!container) return
  const paths = container.querySelectorAll('path[id], path[name]')
  paths.forEach((p) => {
    const el = p as SVGPathElement
    const id = el.getAttribute('id') || ''
    const nameAttr = el.getAttribute('name')
    let friendly = nameAttr || id
    const m = id.match(/^BR([A-Z]{2})$/i)
    if (!nameAttr && m && m[1]) {
      const uf = m[1].toUpperCase()
      const abbrevMap: Record<string, string> = {
        AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins'
      }
      friendly = abbrevMap[uf] || id
    }
    if (isStateSelected(friendly)) el.classList.add('state-active')
    else el.classList.remove('state-active')
  })
  // update labels to reflect selection
  updateLabels()
}

function updateSvgFills() {
  const container = document.querySelector('.svg-container') as HTMLElement | null
  if (!container) return
  const paths = container.querySelectorAll('path[id], path[name]')
  paths.forEach((p) => {
    const el = p as SVGPathElement
    const id = el.getAttribute('id') || ''
    const nameAttr = el.getAttribute('name')
    let friendly = nameAttr || id
    const m = id.match(/^BR([A-Z]{2})$/i)
    if (!nameAttr && m && m[1]) {
      const uf = m[1].toUpperCase()
      const abbrevMap: Record<string, string> = {
        AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins'
      }
      friendly = abbrevMap[uf] || id
    }
    // if state is selected, paint it with the primary color (silhouette highlight)
    const primaryCss = getComputedStyle(document.documentElement).getPropertyValue('--bb-blue-700') || getComputedStyle(document.documentElement).getPropertyValue('--color-primary') || '#2b6cb0'
    const primary = primaryCss.trim() || '#2b6cb0'
    if (isStateSelected(friendly)) {
      el.style.fill = primary
      return
    }
    // if a legend range is active, highlight only matching states (others dimmed)
    if (activeRange.value !== null) {
      const idx = activeRange.value
      const inRange = isInRange(friendly, idx)
      el.style.fill = inRange ? fillFor(friendly) : 'rgba(200,200,200,0.25)'
    } else {
      el.style.fill = fillFor(friendly)
    }
  })
  // inject labels from stateIdMap as <text> elements inside the SVG
  try {
    const map = stateIdMap as Record<string, any>
    const svgEl = container.querySelector('svg')
    if (svgEl) {
      Object.keys(map).forEach((k) => {
        const info = map[k]
        if (!info || typeof info.cx !== 'number' || typeof info.cy !== 'number') return
        // reuse existing text element when present
        let text = svgEl.querySelector(`text[data-state-id="${k}"]`) as SVGTextElement | null
        if (!text) {
          text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
          text.setAttribute('data-state-id', k)
          text.setAttribute('class', 'map-label')
          text.setAttribute('pointer-events', 'none')
          svgEl.appendChild(text)
        }
        text.setAttribute('x', String(info.cx))
        text.setAttribute('y', String(info.cy))
        text.setAttribute('data-state-name', info.name)
        // show name by default; will be swapped to value when selected
        text.textContent = info.name
      })
    }
  } catch (e) {
    // non-blocking
  }
  // after fills updated, refresh labels
  updateLabels()
}


function updateLabels() {
  const container = document.querySelector('.svg-container') as HTMLElement | null
  if (!container) return
  const texts = container.querySelectorAll('text[data-state-id]')
  texts.forEach((t) => {
    const el = t as SVGTextElement
    const id = el.getAttribute('data-state-id') || ''
    const name = el.getAttribute('data-state-name') || ''
    // prefer the friendly name lookup from stateIdMap
    const entry = (stateIdMap as Record<string, any>)[id]
    const friendlyName = entry?.name || name || id
    const dataRec = getDataByName(friendlyName)
    if (isStateSelected(friendlyName)) {
      // show adesao percent inside label when selected
      const pct = dataRec ? percent(dataRec) : ''
      el.textContent = pct || valueFor(friendlyName).toLocaleString('pt-BR')
    } else {
      el.textContent = friendlyName
    }
  })
}
// --- Legend / ranges logic ---
const ranges = ref<Array<{ label: string; min: number; max: number; color: string }>>([])

function computeRanges() {
  const values = props.data.map(d => d.count || 0).filter(v => v > 0).sort((a, b) => a - b)
  if (!values.length) {
    ranges.value = []
    return
  }
  // quartiles (0-25,25-50,50-75,75-100)
  const q = (p: number) => {
    const idx = Math.floor((values.length - 1) * p)
    return values[idx] ?? 0
  }
  const thresholds: number[] = [0, q(0.25), q(0.5), q(0.75), values[values.length - 1] ?? 0]
  const colors = legendColors
  ranges.value = []
  for (let i = 0; i < 4; i++) {
    const min = thresholds[i] ?? 0
    const max = thresholds[i + 1] ?? min
    const label = min === max ? `${min.toLocaleString('pt-BR')}` : `${min.toLocaleString('pt-BR')} – ${max.toLocaleString('pt-BR')}`
    const color = (colors[i] || colors[colors.length - 1] || '#6fa6e0') as string
    ranges.value.push({ label, min, max, color })
  }
}

function statesInRange(idx: number) {
  const rng = ranges.value[idx]
  if (!rng) return []
  return props.data.filter(d => {
    const v = d.count || 0
    return v >= rng.min && v <= rng.max
  }).map(d => d.Estado)
}

function isInRange(name: string, idx: number) {
  const states = statesInRange(idx)
  return states.includes(name)
}

const legendColors = ['#f2f4f8', '#cfe1ff', '#9bbbe8', '#6fa6e0', getComputedStyle(document.documentElement).getPropertyValue('--bb-blue-900') || '#102b57']
</script>

<style>
.map-wrap {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.svg-container svg .state-path,
.svg-container svg path {
  stroke: rgba(16, 43, 87, 0.08);
  stroke-width: 0.8;
  cursor: pointer;
  transition: fill 200ms ease, stroke 200ms ease;
}

.svg-container svg .state-active,
.svg-container svg path.state-active {
  stroke: var(--bb-yellow-500);
  stroke-width: 1.6;
}

/* label styling */
.map-label {
  font-size: 10px;
  fill: var(--color-base-content);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  pointer-events: none;
}

/* tooltip styling */
.map-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 8px 10px;
  border-radius: 6px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.6);
  font-size: 13px;
  line-height: 1.1;
  max-width: 220px;
  pointer-events: none;
}

.map-tooltip .tooltip-title {
  font-weight: 600;
  margin-bottom: 6px
}

.map-tooltip .tooltip-row {
  margin-bottom: 2px
}

.tooltip-value-primary {
  font-weight: 800;
  color: var(--bb-blue-700, var(--color-primary, #0b3a7e));
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.6);
}

/* ensure visibility in dark themes: use a lighter BB blue variant with stronger glow */
:root[data-theme='dark'] .map-tooltip .tooltip-value-primary {
  color: var(--bb-blue-300, #8fbdfd) !important;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.6), 0 0 8px rgba(143, 189, 253, 0.18);
  -webkit-text-stroke: 0.25px rgba(0, 0, 0, 0.6);
}

@media (prefers-color-scheme: dark) {
  .map-tooltip .tooltip-value-primary {
    color: var(--bb-blue-300, #8fbdfd) !important;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.6), 0 0 8px rgba(143, 189, 253, 0.18);
    -webkit-text-stroke: 0.25px rgba(0, 0, 0, 0.6);
  }
}

.map-label {
  font-size: 10px;
  fill: var(--color-base-content);
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  pointer-events: none;
}

.map-tooltip {
  position: fixed;
  pointer-events: none;
  background: rgba(10, 10, 10, 0.9);
  color: #fff;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 12px;
  z-index: 60;
}

.map-legend {
  position: absolute;
  right: 12px;
  top: 12px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
  font-size: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.map-stage {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.map-area {
  flex: 1 1 auto;
  min-width: 360px;
}

.map-sidebar {
  width: 20rem;
  /* 320px */
  max-height: 72vh;
  overflow: auto;
}

.legend-items {
  display: flex;
  gap: 6px;
  align-items: center
}

.legend-item {
  display: flex;
  gap: 6px;
  align-items: center;
  border: 1px solid transparent;
  padding: 4px 6px;
  border-radius: 6px;
  background: transparent;
  color: var(--color-base-content);
}

.legend-item .swatch {
  width: 18px;
  height: 12px;
  border-radius: 3px;
}

.legend-clear {
  margin-left: 8px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 4px 6px;
  border-radius: 6px;
  color: var(--color-base-content);
}

.legend {
  display: flex;
  gap: 8px;
  align-items: center;
}

.legend-scale {
  display: flex;
  gap: 4px;
  align-items: center;
}

.legend-color {
  width: 36px;
  height: 10px;
  border-radius: 2px;
}

.legend-title {
  font-size: 12px;
  color: var(--color-base-content);
  margin-right: 8px;
}

/* Dark theme adjustments for legend to improve readability */
:root[data-theme='dark'] .map-legend {
  background: rgba(10, 10, 10, 0.6);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

:root[data-theme='dark'] .map-legend .legend-title,
:root[data-theme='dark'] .map-legend .legend-item,
:root[data-theme='dark'] .map-legend .legend-item .label,
:root[data-theme='dark'] .map-legend .legend-clear {
  color: var(--color-base-content) !important;
}

:root[data-theme='dark'] .map-legend .legend-item {
  border-color: rgba(255, 255, 255, 0.04);
}

@media (prefers-color-scheme: dark) {
  .map-legend {
    background: rgba(10, 10, 10, 0.6);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.04);
  }

  .map-legend .legend-title,
  .map-legend .legend-item,
  .map-legend .legend-item .label,
  .map-legend .legend-clear {
    color: var(--color-base-content) !important;
  }

  .map-legend .legend-item {
    border-color: rgba(255, 255, 255, 0.04);
  }
}
</style>
