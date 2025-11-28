/**
 * Valida CNPJ
 */
export const validateCNPJ = (cnpj: string): boolean => {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '')

  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false

  // Validação do algoritmo
  let sum = 0
  let weight = 2

  // Primeiro dígito verificador
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight
    weight = weight === 9 ? 2 : weight + 1
  }

  let remainder = sum % 11
  let digit1 = remainder < 2 ? 0 : 11 - remainder

  if (parseInt(cnpj.charAt(12)) !== digit1) return false

  // Segundo dígito verificador
  sum = 0
  weight = 2

  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight
    weight = weight === 9 ? 2 : weight + 1
  }

  remainder = sum % 11
  let digit2 = remainder < 2 ? 0 : 11 - remainder

  return parseInt(cnpj.charAt(13)) === digit2
}

/**
 * Valida email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida se é uma URL válida
 */
export const validateURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Valida se o campo é obrigatório
 */
export const required = (value: any): boolean => {
  if (Array.isArray(value)) return value.length > 0
  return value !== null && value !== undefined && value !== ''
}

/**
 * Valida tamanho mínimo
 */
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min
}

/**
 * Valida tamanho máximo
 */
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max
}
