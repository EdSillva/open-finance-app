import { createRouter, createWebHistory } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Home' },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { title: 'Dashboard' },
      beforeEnter: async () => {
        // Prefetch data for dashboard when navigating to this route
        try {
          const store = useDashboardStore()
          if (!store.loading && store.estadosData.length === 0) {
            await store.fetchDashboardData()
          }
        } catch (e) {
          // ignore errors here — view will show error state
        }
      },
    },
    {
      path: '/prediction',
      name: 'Prediction',
      component: () => import('@/views/PredictionView.vue'),
      meta: { title: 'Predição de Adesão' },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { title: 'Configurações' },
    },
  ],
})

export default router
