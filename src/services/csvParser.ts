/**
 * Serviço para processar dados do CSV de clientes
 */

import type {
  ClientData,
  ClientStats,
  AdesaoPorEstado,
  AdesaoPorFaixaEtaria,
  AdesaoPorRenda,
} from '@/contracts/client'

export class CsvParserService {
  /**
   * Processa dados brutos do CSV
   */
  static parseClientData(rawData: string[][]): ClientData[] {
    return rawData.slice(1).map(row => ({
      cliente: row[0] || '',
      data_nascimento: row[1] || '',
      idade: this.parseNumber(row[2]),
      estado_residencia: this.normalizeEstado(row[3] || ''),
      sexo: this.normalizeSexo(row[4] || ''),
      ocupacao: this.normalizeOcupacao(row[5] || ''),
      grau_escolaridade: this.normalizeEscolaridade(row[6] || ''),
      estado_civil: this.normalizeEstadoCivil(row[7] || ''),
      possui_filhos: this.parseNumber(row[8]),
      saldo_conta: this.parseNumber(row[9]),
      renda: this.parseNumber(row[10]),
      score_credito: this.parseNumber(row[11]),
      possui_outros_bancos: this.parseNumber(row[12]),
      possui_emprestimo: this.parseNumber(row[13]),
      possui_financiamento: this.parseNumber(row[14]),
      possui_cartao_credito: this.parseNumber(row[15]),
      limite_cartao: this.parseNumber(row[16]),
      gastos_mensais: this.parseNumber(row[17]),
      usa_pix: this.parseNumber(row[18]),
      usa_internet_banking: this.parseNumber(row[19]),
      usa_app_banco: this.parseNumber(row[20]),
      usa_cheque: this.parseNumber(row[21]),
      atraso_pagamentos: this.parseNumber(row[22]),
      tipo_conta: this.normalizeTipoConta(row[23] || ''),
      aderiu_novo_servico: this.parseNumber(row[24]),
      tempo_conta_ativa: this.parseNumber(row[25]),
      investimentos: this.parseNumber(row[26]),
      'adesao-ao-open-finance': this.parseNumber(row[27]),
    }))
  }

  /**
   * Calcula estatísticas gerais
   */
  static calculateStats(clients: ClientData[]): ClientStats {
    const validClients = clients.filter(c => !isNaN(c.idade))
    const aderidos = clients.filter(c => c['adesao-ao-open-finance'] === 1)

    return {
      totalClientes: validClients.length,
      taxaAdesao:
        validClients.length > 0
          ? (aderidos.length / validClients.length) * 100
          : 0,
      mediaIdade:
        validClients.reduce((sum, c) => sum + c.idade, 0) / validClients.length,
      rendaMedia:
        validClients
          .filter(c => c.renda > 0)
          .reduce((sum, c) => sum + c.renda, 0) /
        validClients.filter(c => c.renda > 0).length,
      scoreMedio:
        validClients
          .filter(c => c.score_credito > 0)
          .reduce((sum, c) => sum + c.score_credito, 0) /
        validClients.filter(c => c.score_credito > 0).length,
    }
  }

  /**
   * Agrupa adesão por estado
   */
  static groupByEstado(clients: ClientData[]): AdesaoPorEstado[] {
    const grouped = clients.reduce(
      (acc, client) => {
        const estado = client.estado_residencia
        if (!acc[estado]) {
          acc[estado] = { total: 0, aderiu: 0, naoAderiu: 0 }
        }
        acc[estado].total++
        if (client['adesao-ao-open-finance'] === 1) {
          acc[estado].aderiu++
        } else {
          acc[estado].naoAderiu++
        }
        return acc
      },
      {} as Record<string, { total: number; aderiu: number; naoAderiu: number }>
    )

    return Object.entries(grouped)
      .map(([estado, data]) => ({
        estado,
        ...data,
        percentualAdesao: (data.aderiu / data.total) * 100,
      }))
      .sort((a, b) => b.percentualAdesao - a.percentualAdesao)
  }

  /**
   * Agrupa adesão por faixa etária
   */
  static groupByFaixaEtaria(clients: ClientData[]): AdesaoPorFaixaEtaria[] {
    const getFaixa = (idade: number): string => {
      if (idade < 25) return '18-24'
      if (idade < 35) return '25-34'
      if (idade < 45) return '35-44'
      if (idade < 55) return '45-54'
      if (idade < 65) return '55-64'
      return '65+'
    }

    const grouped = clients.reduce(
      (acc, client) => {
        const faixa = getFaixa(client.idade)
        if (!acc[faixa]) {
          acc[faixa] = { total: 0, aderiu: 0, naoAderiu: 0 }
        }
        acc[faixa].total++
        if (client['adesao-ao-open-finance'] === 1) {
          acc[faixa].aderiu++
        } else {
          acc[faixa].naoAderiu++
        }
        return acc
      },
      {} as Record<string, { total: number; aderiu: number; naoAderiu: number }>
    )

    const order = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
    return order
      .filter(faixa => grouped[faixa])
      .map(faixa => {
        const data = grouped[faixa]!
        return {
          faixa,
          total: data.total,
          aderiu: data.aderiu,
          naoAderiu: data.naoAderiu,
          percentualAdesao: (data.aderiu / data.total) * 100,
        }
      })
  }

  /**
   * Agrupa adesão por faixa de renda
   */
  static groupByRenda(clients: ClientData[]): AdesaoPorRenda[] {
    const getGrupo = (renda: number): string => {
      if (renda <= 2000) return 'Até R$ 2.000'
      if (renda <= 5000) return 'R$ 2.001 - R$ 5.000'
      if (renda <= 10000) return 'R$ 5.001 - R$ 10.000'
      if (renda <= 20000) return 'R$ 10.001 - R$ 20.000'
      return 'Acima de R$ 20.000'
    }

    const grouped = clients
      .filter(c => c.renda > 0)
      .reduce(
        (acc, client) => {
          const grupo = getGrupo(client.renda)
          if (!acc[grupo]) {
            acc[grupo] = { total: 0, aderiu: 0, naoAderiu: 0 }
          }
          acc[grupo].total++
          if (client['adesao-ao-open-finance'] === 1) {
            acc[grupo].aderiu++
          } else {
            acc[grupo].naoAderiu++
          }
          return acc
        },
        {} as Record<
          string,
          { total: number; aderiu: number; naoAderiu: number }
        >
      )

    const order = [
      'Até R$ 2.000',
      'R$ 2.001 - R$ 5.000',
      'R$ 5.001 - R$ 10.000',
      'R$ 10.001 - R$ 20.000',
      'Acima de R$ 20.000',
    ]
    return order
      .filter(grupo => grouped[grupo])
      .map(grupo => {
        const data = grouped[grupo]!
        return {
          grupo,
          total: data.total,
          aderiu: data.aderiu,
          naoAderiu: data.naoAderiu,
          percentualAdesao: (data.aderiu / data.total) * 100,
        }
      })
  }

  // Funções auxiliares de normalização
  private static parseNumber(value: string | undefined): number {
    if (!value || value === '' || value === '###INVALIDO###') return 0
    const cleaned = value.replace(',', '.')
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
  }

  private static normalizeEstado(value: string): string {
    if (!value || value === '###INVALIDO###') return 'Não informado'
    return value.trim()
  }

  private static normalizeSexo(value: string): string {
    if (!value) return 'Não informado'
    if (value === 'Masc') return 'M'
    if (value === 'Fem') return 'F'
    return 'Outro'
  }

  private static normalizeOcupacao(value: string): string {
    if (!value || value === '') return 'Não informado'
    return value.trim()
  }

  private static normalizeEscolaridade(value: string): string {
    const map: Record<string, string> = {
      Fundam: 'Fundamental',
      Medio: 'Médio',
      Super: 'Superior',
      Posgrad: 'Pós-graduação',
      Mestrado: 'Mestrado',
      Doutori: 'Doutorado',
    }
    return map[value] || value || 'Não informado'
  }

  private static normalizeEstadoCivil(value: string): string {
    const map: Record<string, string> = {
      Solteiro: 'Solteiro',
      Casado: 'Casado',
      Divorciado: 'Divorciado',
      Viúvo: 'Viúvo',
      UniaoEstave: 'União Estável',
    }
    return map[value] || 'Não informado'
  }

  private static normalizeTipoConta(value: string): string {
    if (!value || value === '###INVALIDO###') return 'Não informado'
    const map: Record<string, string> = {
      Digital: 'Digital',
      Corrente: 'Corrente',
      Poupanca: 'Poupança',
    }
    return map[value] || value
  }
}
