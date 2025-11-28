/**
 * Interfaces para dados de clientes do Open Finance
 */

export interface ClientData {
  cliente: string
  data_nascimento: string
  idade: number
  estado_residencia: string
  sexo: string
  ocupacao: string
  grau_escolaridade: string
  estado_civil: string
  possui_filhos: number
  saldo_conta: number
  renda: number
  score_credito: number
  possui_outros_bancos: number
  possui_emprestimo: number
  possui_financiamento: number
  possui_cartao_credito: number
  limite_cartao: number
  gastos_mensais: number
  usa_pix: number
  usa_internet_banking: number
  usa_app_banco: number
  usa_cheque: number
  atraso_pagamentos: number
  tipo_conta: string
  aderiu_novo_servico: number
  tempo_conta_ativa: number
  investimentos: number
  'adesao-ao-open-finance': number
}

export interface ClientStats {
  totalClientes: number
  taxaAdesao: number
  mediaIdade: number
  rendaMedia: number
  scoreMedio: number
}

export interface AdesaoPorEstado {
  estado: string
  total: number
  aderiu: number
  naoAderiu: number
  percentualAdesao: number
}

export interface AdesaoPorFaixaEtaria {
  faixa: string
  total: number
  aderiu: number
  naoAderiu: number
  percentualAdesao: number
}

export interface AdesaoPorRenda {
  grupo: string
  total: number
  aderiu: number
  naoAderiu: number
  percentualAdesao: number
}
