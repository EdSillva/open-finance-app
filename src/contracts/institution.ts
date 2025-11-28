export interface Institution {
  id: string
  name: string
  type: string
  status: string
  registrationDate?: string
  apis?: number
  cnpj?: string
  contact?: string
}

export interface InstitutionFilters {
  search: string
  type: string
  status: string
}

export interface PaginationData {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}
