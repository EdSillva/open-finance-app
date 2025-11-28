# Open Finance Dashboard - Frontend

Dashboard interativo para análise de dados de clientes e predição de adesão ao Open Finance usando Machine Learning.

## 🚀 Funcionalidades

### 1. **Dashboard Principal**

- Visualização de estatísticas gerais de clientes
- Gráficos de distribuição por estado, faixa etária e renda
- Análise de adesão ao Open Finance

### 2. **Predição de Adesão (ML)**

- Formulário interativo para entrada de dados do cliente
- Predição em tempo real usando API backend (PySpark + Random Forest)
- Visualização de probabilidades de adesão
- Ranking das features mais importantes
- Monitoramento do status da API em tempo real

## 📋 Pré-requisitos

- Node.js 18+ ou pnpm
- Backend rodando em `http://localhost:8000` (veja `../opf-api`)

## 🛠️ Instalação

```bash
pnpm install
```

## ⚙️ Configuração

Crie o arquivo `.env` para desenvolvimento local (NÃO commite este arquivo):

```env
# URL do backend em desenvolvimento
VITE_API_URL=http://localhost:8000
```

repositorio da API:

- https://github.com/EdSillva/opf-api

Nota sobre produção:

- O Vite substitui `import.meta.env.VITE_API_URL` em tempo de _build_. Para definir a URL da API em produção, configure a variável `VITE_API_URL` no seu provedor de build (Netlify, Vercel, GitHub Actions, etc.) ou use um arquivo de configuração em runtime (veja abaixo).

Runtime config (trocar URL sem rebuild):

1. No servidor, coloque um arquivo `config.json` em `public/` gerado no deploy com o conteúdo:

```json
{
  "VITE_API_URL": "https://api.sua-prod.com"
}
```

2. Em `src/main.ts` carregue esse arquivo antes de montar a app e exponha em `window.__APP_CONFIG__`.

3. No código use:

```ts
const apiUrl =
  (window as any).__APP_CONFIG__?.VITE_API_URL || import.meta.env.VITE_API_URL
```

Essa abordagem permite alterar a URL da API no servidor sem rebuildar o bundle.

## 🚀 Executar

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Preview
pnpm preview
```

A aplicação estará disponível em `http://localhost:5173`

## 🔗 Integração com Backend

### Endpoint de Predição

```typescript
POST http://localhost:8000/predict/

Body: {
  "Faixa_etaria": "25-34",
  "Estado": "SP",
  "Sexo": "M",
  // ... demais campos
}

Response: {
  "prediction": 1,
  "probability": [0.23, 0.77],
  "label": "Vai aderir ao Open Finance",
  "global_feature_importances": {...}
}
```

## 🧪 Fluxo de Uso

1. Inicie o backend: `cd ../opf-api && python run.py`
2. Inicie o frontend: `pnpm dev`
3. Acesse: `http://localhost:5173/prediction`
4. Preencha o formulário e clique em "Fazer Predição"

## 🎨 Tecnologias

- Vue 3 + TypeScript
- Vite
- Vue Router + Pinia
- TailwindCSS + DaisyUI
