<template>
  <div class="max-w-4xl mx-auto text-center py-20">
    <h1 class="text-4xl font-bold mb-4">Bem-vindo ao OpenLens App</h1>
    <p class="text-lg text-muted mb-8">Este é um painel demonstrativo para visualizações e predições.</p>
    <div class="flex justify-center gap-4">
      <router-link to="/dashboard" class="btn btn-primary">Ir para Dashboard</router-link>
      <router-link to="/prediction" class="btn btn-outline">Fazer Predição</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// simples página de boas-vindas
</script>

<style scoped>
/* pequenas customizações se necessário */
</style>
