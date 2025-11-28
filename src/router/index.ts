import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { title: 'Dashboard' },
    },
    {
      path: '/prediction',
      name: 'Prediction',
      component: () => import('@/views/PredictionView.vue'),
      meta: { title: 'Predição de Adesão' },
    },
    {
      path: '/institutions',
      name: 'Institutions',
      component: () => import('@/views/InstitutionsView.vue'),
      meta: { title: 'Instituições' },
    },
    {
      path: '/services',
      name: 'Services',
      component: () => import('@/views/ServicesView.vue'),
      meta: { title: 'Serviços' },
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: () => import('@/views/AnalyticsView.vue'),
      meta: { title: 'Analytics' },
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
