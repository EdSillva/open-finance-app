import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardStats, EstadoData } from '@/contracts/dashboard'
// Institution type import removed (no longer used)
import { apiService } from '@/services/api'

export const useDashboardStore = defineStore('dashboard', () => {
  // Estado
  const stats = ref<DashboardStats>({
    totalInstitutions: 0,
    activeServices: 0,
    totalApis: 0,
    monthlyTransactions: '0',
  })

  const estadosData = ref<EstadoData[]>([])
  // recentInstitutions removed per UI change
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchDashboardData = async () => {
    loading.value = true
    error.value = null

    try {
      // Buscar estatísticas reais do backend
      const statsData = await apiService.getStatistics()

      // Atualizar stats principais
      stats.value = {
        totalInstitutions: statsData.geral.total_clientes,
        activeServices: statsData.geral.aderiu,
        totalApis: statsData.geral.nao_aderiu,
        monthlyTransactions: `${statsData.geral.taxa_adesao.toFixed(1)}%`,
      }

      // Processar dados por estado (ordenados por total de clientes)
      const estadosOrdenados = statsData.por_estado.sort(
        (a: any, b: any) => b.count - a.count
      )

      estadosData.value = estadosOrdenados.map((item: any) => ({
        Estado: item.Estado,
        count: item.count,
        aderiu: item.aderiu || 0,
        nao_aderiu: item.nao_aderiu || 0,
      }))

      // recentInstitutions fetching removed — UI no longer displays amostra
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err)
      error.value = 'Erro ao carregar dados. Verifique se a API está rodando.'
      // retry once after short delay for transient errors (cold start)
      try {
        await new Promise(res => setTimeout(res, 1000))
        const statsDataRetry = await apiService.getStatistics()
        const estadosOrdenados = statsDataRetry.por_estado.sort(
          (a: any, b: any) => b.count - a.count
        )
        estadosData.value = estadosOrdenados.map((item: any) => ({
          Estado: item.Estado,
          count: item.count,
          aderiu: item.aderiu || 0,
          nao_aderiu: item.nao_aderiu || 0,
        }))
        error.value = null
      } catch (err2) {
        console.error('Retry falhou:', err2)
      }
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    estadosData,
    // recentInstitutions removed
    loading,
    error,
    fetchDashboardData,
    // pagination removed (not used after UI change)
  }
})
