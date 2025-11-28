<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Configurações</h1>
      <p class="text-base-content/70 mt-1">Configure as preferências do sistema</p>
    </div>

    <SettingsPage />
  </div>
</template>

<script setup lang="ts">
import SettingsPage from '@/components/SettingsPage.vue'
</script>
