<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Configurações</h1>
      <p class="text-base-content/70 mt-1">Configure as preferências do sistema</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Preferências do Sistema</h2>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Tema Escuro</span>
              <input type="checkbox" class="toggle toggle-primary" v-model="isDark" />
            </label>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Página de Configurações
</script>
<script lang="ts">
import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

const applyTheme = (dark: boolean) => {
  const theme = dark ? 'bb-dark' : 'bb'
  document.documentElement.setAttribute('data-theme', theme)
}

onMounted(() => {
  const saved = localStorage.getItem('opf-theme')
  if (saved) {
    isDark.value = saved === 'dark'
    applyTheme(isDark.value)
  }
})

watch(isDark, (v) => {
  localStorage.setItem('opf-theme', v ? 'dark' : 'light')
  applyTheme(v)
})
</script>
