<template>
  <aside class="min-h-full w-80 bg-base-200">
    <!-- Logo/Header -->
    <div class="p-4 border-b border-base-300">
      <h2 class="text-2xl font-bold text-primary">OpenLens</h2>
      <p class="text-sm text-base-content/70">Dashboard Analytics</p>
    </div>

    <!-- Menu de navegação -->
    <ul class="menu p-4 text-base-content">
      <li>
        <router-link to="/" class="flex items-center gap-3" :class="{ 'active': $route.name === 'Dashboard' }">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
            </path>
          </svg>
          Home
        </router-link>
      </li>

      <li>
        <router-link to="/dashboard" class="flex items-center gap-3" :class="{ 'active': $route.name === 'Dashboard' }">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
            </path>
          </svg>
          Dashboard
        </router-link>
      </li>

      <li>
        <router-link to="/prediction" class="flex items-center gap-3"
          :class="{ 'active': $route.name === 'Prediction' }">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
            </path>
          </svg>
          Predição ML
        </router-link>
      </li>

      <div class="divider"></div>

      <li>
        <router-link to="/settings" class="flex items-center gap-3" :class="{ 'active': $route.name === 'Settings' }">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
            </path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
            </path>
          </svg>
          Configurações
        </router-link>
      </li>
    </ul>

    <!-- Footer da sidebar -->
    <div class="absolute bottom-0 w-full p-4 border-t border-base-300">
      <div class="flex items-center gap-3">
        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content rounded-full w-10">
            <span class="text-xs">OF</span>
          </div>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">Admin User</p>
          <p class="text-xs text-base-content/70">admin@openfinance.com</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
</script>

<style scoped>
.router-link-active {
  background-color: hsl(var(--p));
  color: hsl(var(--pc));
}
</style>
