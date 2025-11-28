export interface DashboardStats {
  totalInstitutions: number
  activeServices: number
  totalApis: number
  monthlyTransactions: string
}

export interface InstitutionTypeData {
  type: string
  count: number
  percentage: number
}

export interface EstadoData {
  Estado: string
  count: number
  aderiu: number
  nao_aderiu: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  errors?: string[]
}
