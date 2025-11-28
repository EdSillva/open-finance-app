<template>
  <div class="card bg-base-200 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-6">🔮 Predição de Adesão ao Open Finance</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Dados Demográficos -->
        <div class="divider">Dados Demográficos</div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Faixa Etária</span>
            </label>
            <select v-model="formData.Faixa_etaria" class="select select-bordered" required>
              <option value="">Selecione...</option>
              <option value="18-29 anos">18-29 anos</option>
              <option value="30-39 anos">30-39 anos</option>
              <option value="40-49 anos">40-49 anos</option>
              <option value="50-59 anos">50-59 anos</option>
              <option value="60-69 anos">60-69 anos</option>
              <option value="70-79 anos">70-79 anos</option>
              <option value="80-89 anos">80-89 anos</option>
              <option value="90+">90+</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Estado</span>
            </label>
            <select v-model="formData.Estado" class="select select-bordered" required>
              <option value="">Selecione...</option>
              <option v-for="estado in estados" :key="estado" :value="estado">{{ estado }}</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Sexo</span>
            </label>
            <select v-model="formData.Sexo" class="select select-bordered" required>
              <option value="">Selecione...</option>
              <option value="Masc">Masculino</option>
              <option value="Fem">Feminino</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Ocupação</span>
            </label>
            <select v-model="formData.Ocupacao" class="select select-bordered" required>
              <option value="">Selecione...</option>
              <option value="Administrador">Administrador</option>
              <option value="Advogado">Advogado</option>
              <option value="Analista">Analista</option>
              <option value="Atendente">Atendente</option>
              <option value="Auxiliar">Auxiliar</option>
              <option value="Comerciante">Comerciante</option>
              <option value="Coordenador">Coordenador</option>
              <option value="Enfermeiro">Enfermeiro</option>
              <option value="Engenheiro">Engenheiro</option>
              <option value="Gestor">Gestor</option>
              <option value="Motorista">Motorista</option>
              <option value="Operario">Operário</option>
              <option value="PesqSênior">Pesquisador Sênior</option>
              <option value="Pesquisador">Pesquisador</option>
              <option value="ProfUniv">Professor Universitário</option>
              <option value="Professor">Professor</option>
              <option value="Tecnico">Técnico</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Não informado">Não informado</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Escolaridade</span>
            </label>
            <select v-model="formData.Escolaridade" class="select select-bordered" required>
              <option value="">Selecione...</option>
              <option value="Fundam">Fundamental</option>
              <option value="Medio">Médio</option>
              <option value="Super">Superior</option>
              <option value="Posgrad">Pós-graduação</option>
              <option value="Mestrado">Mestrado</option>
              <option value="Doutori">Doutorado</option>
            </select>
          </div>
        </div>

        <!-- Dados Financeiros -->
        <div class="divider">Dados Financeiros</div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Grupo de Renda</span>
            </label>
            <select v-model="formData.Gp_renda" class="select select-bordered" required>
              <option value="">Selecione...</option>
              <option value="até R$999">Até R$ 999</option>
              <option value="R$1.000–1.999">R$ 1.000 - 1.999</option>
              <option value="R$2.000–2.999">R$ 2.000 - 2.999</option>
              <option value="R$3.000–4.999">R$ 3.000 - 4.999</option>
              <option value="R$5.000–9.999">R$ 5.000 - 9.999</option>
              <option value="R$10.000–19.999">R$ 10.000 - 19.999</option>
              <option value="R$20.000–29.999">R$ 20.000 - 29.999</option>
              <option value="R$30.000–39.999">R$ 30.000 - 39.999</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Tipo de Conta</span>
            </label>
            <select v-model="formData.Tipo_da_conta" class="select select-bordered" required>
              <option value="">Selecione...</option>
              <option value="Digital">Digital</option>
              <option value="Corrente">Corrente</option>
              <option value="Poupanca">Poupança</option>
              <option value="Não informado">Não informado</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Score de Crédito</span>
            </label>
            <select v-model="formData.Gp_score_de_credito" class="select select-bordered" required>
              <option value="">Selecione...</option>
              <option value="0–300)">0 - 300</option>
              <option value="301–600">301 - 600</option>
              <option value="R$601–800">601 - 800</option>
              <option value="R$801–1000">801 - 1000</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Limite do Cartão</span>
            </label>
            <select v-model="formData.Gp_limite_do_cartao" class="select select-bordered" required>
              <option value="">Selecione...</option>
              <option value="até R$499">Até R$ 499</option>
              <option value="R$500–1.999">R$ 500 - 1.999</option>
              <option value="R$2.000-2.999">R$ 2.000 - 2.999</option>
              <option value="R$3.000-4.999">R$ 3.000 - 4.999</option>
              <option value="R$5.000–6.999">R$ 5.000 - 6.999</option>
              <option value="R$7.000-R$9.999">R$ 7.000 - 9.999</option>
              <option value="R$10.000–19.999">R$ 10.000 - 19.999</option>
              <option value="R$20.000–29.999">R$ 20.000 - 29.999</option>
              <option value="R$30.000-49.0000">R$ 30.000 - 49.000</option>
              <option value="R$50.000-69.000">R$ 50.000 - 69.000</option>
              <option value="R$70.000-89.000">R$ 70.000 - 89.000</option>
              <option value="R$90.000-R$99.000">R$ 90.000 - 99.000</option>
              <option value="R$100.000+">R$ 100.000+</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Tempo de Conta Ativa (anos)</span>
            </label>
            <input v-model.number="formData.Tempo_conta_atv" type="number" min="1" max="72" class="input input-bordered"
              placeholder="Digite de 1 a 72 anos" required />
          </div>
        </div>

        <div class="divider">Comportamento Bancário</div>

        <div class="space-y-2">
          <div v-for="b in behaviors" :key="b.key" class="flex items-center justify-between">
            <div class="text-base-content truncate">{{ b.label }}</div>
            <input :aria-label="b.label" type="checkbox" class="toggle toggle-primary"
              :model-value="formDataValue(b.key).value" @update:model-value="makeUpdater(b.key)" />
          </div>
        </div>

        <div class="card-actions justify-end mt-6">
          <button type="button" @click="resetForm" class="btn btn-ghost">Limpar</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner"></span>
            {{ loading ? 'Analisando...' : 'Fazer Predição' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PredictionRequest } from '@/services/api'

const emit = defineEmits<{
  submit: [data: PredictionRequest]
}>()

defineProps<{
  loading?: boolean
}>()

const estados = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
  'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO', 'Não informado'
]

const formData = ref({
  Faixa_etaria: '',
  Estado: '',
  Sexo: '',
  Ocupacao: '',
  Escolaridade: '',
  Gp_renda: '',
  Tipo_da_conta: '',
  Gp_score_de_credito: '',
  Gp_limite_do_cartao: '',
  Tempo_conta_atv: 1,
  Outros_bancos: false,
  Emprestimo: false,
  Financiamento: false,
  Cartao_de_credito: false,
  Usa_cheque: false,
  Atrasa_pag: false,
  Investimentos: false,
  Usa_pix: false,
  Usa_eBanking: false,
  Usa_app_banco: false,
})

const behaviors = [
  { key: 'Outros_bancos', label: 'Outros Bancos' },
  { key: 'Emprestimo', label: 'Empréstimo' },
  { key: 'Financiamento', label: 'Financiamento' },
  { key: 'Cartao_de_credito', label: 'Cartão de Crédito' },
  { key: 'Usa_cheque', label: 'Usa Cheque' },
  { key: 'Atrasa_pag', label: 'Atrasa Pagamentos' },
  { key: 'Investimentos', label: 'Investimentos' },
  { key: 'Usa_pix', label: 'Usa PIX' },
  { key: 'Usa_eBanking', label: 'Usa eBanking' },
  { key: 'Usa_app_banco', label: 'Usa App Banco' },
]

const formDataValue = (key: string) => {
  return computed<boolean>({
    get() {
      return (formData.value as any)[key]
    },
    set(v: boolean) {
      ; (formData.value as any)[key] = v
    },
  })
}

const makeUpdater = (key: string) => {
  return (v: boolean) => {
    ; (formData.value as any)[key] = v
  }
}

const handleSubmit = () => {
  const data: PredictionRequest = {
    Faixa_etaria: formData.value.Faixa_etaria,
    Estado: formData.value.Estado,
    Sexo: formData.value.Sexo,
    Ocupacao: formData.value.Ocupacao,
    Escolaridade: formData.value.Escolaridade,
    Gp_renda: formData.value.Gp_renda,
    Tipo_da_conta: formData.value.Tipo_da_conta,
    Gp_score_de_credito: formData.value.Gp_score_de_credito,
    Gp_limite_do_cartao: formData.value.Gp_limite_do_cartao,
    Tempo_conta_atv: String(formData.value.Tempo_conta_atv),
    Outros_bancos: formData.value.Outros_bancos ? 1 : 0,
    Emprestimo: formData.value.Emprestimo ? 1 : 0,
    Financiamento: formData.value.Financiamento ? 1 : 0,
    Cartao_de_credito: formData.value.Cartao_de_credito ? 1 : 0,
    Usa_cheque: formData.value.Usa_cheque ? 1 : 0,
    Atrasa_pag: formData.value.Atrasa_pag ? 1 : 0,
    Investimentos: formData.value.Investimentos ? 1 : 0,
    Usa_pix: formData.value.Usa_pix ? 1 : 0,
    Usa_eBanking: formData.value.Usa_eBanking ? 1 : 0,
    Usa_app_banco: formData.value.Usa_app_banco ? 1 : 0,
  }

  emit('submit', data)
}

const resetForm = () => {
  formData.value = {
    Faixa_etaria: '',
    Estado: '',
    Sexo: '',
    Ocupacao: '',
    Escolaridade: '',
    Gp_renda: '',
    Tipo_da_conta: '',
    Gp_score_de_credito: '',
    Gp_limite_do_cartao: '',
    Tempo_conta_atv: 1,
    Outros_bancos: false,
    Emprestimo: false,
    Financiamento: false,
    Cartao_de_credito: false,
    Usa_cheque: false,
    Atrasa_pag: false,
    Investimentos: false,
    Usa_pix: false,
    Usa_eBanking: false,
    Usa_app_banco: false,
  }
}
</script>

<style scoped>
.form-control .label {
  display: block;
  margin-bottom: 0.25rem;
}

.form-control .label .label-text {
  display: block;
  font-weight: 600;
}

.form-control .select,
.form-control .input,
.form-control input[type="number"],
.form-control .toggle,
.form-control .textarea {
  display: block;
  margin-top: 0.25rem;
}

@media (min-width: 640px) {
  .form-control .label {
    margin-bottom: 0.25rem;
  }
}
</style>
