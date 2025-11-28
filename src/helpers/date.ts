/**
 * Formata uma data para o padrão brasileiro
 */
export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }

  return new Intl.DateTimeFormat('pt-BR', {
    ...defaultOptions,
    ...options,
  }).format(dateObj)
}

/**
 * Formata uma data e hora para o padrão brasileiro
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calcula a diferença entre duas datas em dias
 */
export const getDaysDifference = (
  date1: Date | string,
  date2: Date | string
): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2

  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Verifica se uma data está no passado
 */
export const isPastDate = (date: Date | string): boolean => {
  const checkDate = typeof date === 'string' ? new Date(date) : date
  return checkDate < new Date()
}

/**
 * Retorna uma data formatada como "há X tempo"
 */
export const timeAgo = (date: Date | string): string => {
  const now = new Date()
  const past = typeof date === 'string' ? new Date(date) : date
  const diffMs = now.getTime() - past.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `há ${years} ano${years > 1 ? 's' : ''}`
  if (months > 0) return `há ${months} mês${months > 1 ? 'es' : ''}`
  if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`
  if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`
  if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`
  return 'agora mesmo'
}
