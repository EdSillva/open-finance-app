import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import { useDashboardStore } from '@/stores/dashboard'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

// Prefetch dashboard data in background to improve perceived load time
// Run after mount to avoid blocking initial render.
setTimeout(() => {
  try {
    const store = useDashboardStore()
    // start fetch but do not await — background warming
    store.fetchDashboardData()
  } catch (e) {
    // ignore in SSR or non-client contexts
    // console.warn('Prefetch failed', e)
  }
}, 200)
