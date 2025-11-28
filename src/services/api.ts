/**
 * Serviço de API para comunicação com o backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface PredictionRequest {
  Faixa_etaria: string
  Estado: string
  Sexo: string
  Ocupacao: string
  Escolaridade: string
  Gp_renda: string
  Tipo_da_conta: string
  Gp_score_de_credito: string
  Gp_limite_do_cartao: string
  Tempo_conta_atv: string | number
  Outros_bancos: number
  Emprestimo: number
  Financiamento: number
  Cartao_de_credito: number
  Usa_cheque: number
  Atrasa_pag: number
  Investimentos: number
  Usa_pix: number
  Usa_eBanking: number
  Usa_app_banco: number
}

export interface PredictionResponse {
  prediction: number
  probability: number[]
  label: string
  global_feature_importances:
    | Array<{ feature: string; importance: number }>
    | Record<string, number>
}

export interface ClientDataResponse {
  success: boolean
  total_records: number
  returned_records: number
  statistics: {
    total: number
    aderiu: number
    nao_aderiu: number
    taxa_adesao: number
  }
  data: any[]
}

export interface StatsResponse {
  success: boolean
  geral: {
    total_clientes: number
    aderiu: number
    nao_aderiu: number
    taxa_adesao: number
  }
  por_estado: Array<{ Estado: string; count: number }>
  por_faixa_etaria: Array<{ 'Faixa etária': string; count: number }>
  por_renda: Array<{ 'Gp renda': string; Adesao_ao_OPF: number; count: number }>
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  async predict(data: PredictionRequest): Promise<PredictionResponse> {
    const response = await fetch(`${this.baseUrl}/predict/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async getClientsData(
    limit: number = 1000,
    offset: number = 0
  ): Promise<ClientDataResponse> {
    const response = await fetch(
      `${this.baseUrl}/data/clients?limit=${limit}&offset=${offset}`
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async getStatistics(): Promise<StatsResponse> {
    const response = await fetch(`${this.baseUrl}/data/stats`)

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/docs`)
      return response.ok
    } catch {
      return false
    }
  }
}

export const apiService = new ApiService()
