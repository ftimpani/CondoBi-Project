# 🔌 Guia de Integrações - CondoBI

Este guia explica como configurar todas as integrações do CondoBI: Autenticação, Banco de Dados, OpenAI e Power BI.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Banco de Dados PostgreSQL](#banco-de-dados-postgresql)
3. [Sistema de Autenticação](#sistema-de-autenticação)
4. [Integração OpenAI](#integração-openai)
5. [Integração Power BI](#integração-power-bi)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Testando as Integrações](#testando-as-integrações)

---

## 🚀 Pré-requisitos

Antes de começar, certifique-se de ter:

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 14.0
- **Conta OpenAI** com API Key
- **Conta Microsoft Azure** (para Power BI)
- **Git** instalado

---

## 🗄️ Banco de Dados PostgreSQL

### 1. Instalar PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Windows:**
- Baixe o instalador em [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Criar Banco de Dados

```bash
# Conectar ao PostgreSQL
sudo -u postgres psql

# Criar database
CREATE DATABASE condobi;

# Criar usuário
CREATE USER condobi_user WITH PASSWORD 'sua_senha_segura';

# Dar permissões
GRANT ALL PRIVILEGES ON DATABASE condobi TO condobi_user;

# Sair
\q
```

### 3. Configurar Variável de Ambiente

Crie o arquivo `.env.local`:

```bash
DATABASE_URL="postgresql://condobi_user:sua_senha_segura@localhost:5432/condobi"
```

### 4. Executar Migrations do Prisma

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar as tabelas no banco
npx prisma db push

# (Opcional) Abrir Prisma Studio para visualizar dados
npx prisma studio
```

### 5. Seed de Dados (Opcional)

Criar arquivo `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar condomínio de exemplo
  const condominio = await prisma.condominio.create({
    data: {
      nome: 'Residencial Exemplo',
      cnpj: '12.345.678/0001-90',
      endereco: 'Rua Exemplo, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      totalUnits: 50,
    }
  })

  // Criar usuário admin
  const hashedPassword = await hash('admin123', 12)

  await prisma.user.create({
    data: {
      email: 'admin@condobi.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
      condominioId: condominio.id,
    }
  })

  console.log('✅ Seed concluído!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Execute:
```bash
npx ts-node prisma/seed.ts
```

---

## 🔐 Sistema de Autenticação

### 1. Configurar NextAuth

Já está configurado! Apenas adicione as variáveis:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gere-uma-chave-secreta-muito-segura-com-32-caracteres-ou-mais
```

**Gerar secret:**
```bash
openssl rand -base64 32
```

### 2. (Opcional) Google OAuth

Para habilitar login com Google:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Vá em **APIs & Services > Credentials**
4. Crie **OAuth 2.0 Client ID**
5. Configure URLs autorizadas:
   - **Authorized JavaScript origins:** `http://localhost:3000`
   - **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`

Adicione ao `.env.local`:
```env
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret
```

### 3. Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/signin` | GET | Página de login |
| `/api/auth/signout` | GET | Logout |
| `/api/auth/register` | POST | Criar novo usuário |
| `/api/auth/session` | GET | Obter sessão atual |

**Exemplo de registro:**
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@exemplo.com',
    password: 'senha123',
    name: 'Nome Usuário',
    role: 'MORADOR'
  })
})
```

---

## 🤖 Integração OpenAI

### 1. Obter API Key

1. Acesse [platform.openai.com](https://platform.openai.com/)
2. Faça login ou crie uma conta
3. Vá em **API Keys**
4. Clique em **Create new secret key**
5. Copie a chave (aparece apenas uma vez!)

### 2. Configurar Variável

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/chat/message` | POST | Enviar mensagem para o SíndicoAI |
| `/api/chat/history` | GET | Buscar histórico de conversas |
| `/api/chat/analyze-document` | POST | Analisar documentos com IA |

**Exemplo de uso do chat:**
```javascript
const response = await fetch('/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Incluir sessão
  body: JSON.stringify({
    message: 'Como funciona a assembleia de condomínio?',
    conversationHistory: [] // Opcional
  })
})

const data = await response.json()
console.log(data.response) // Resposta da IA
```

**Exemplo de análise de documento:**
```javascript
const response = await fetch('/api/chat/analyze-document', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    documentText: 'Texto do contrato aqui...',
    question: 'Este contrato tem alguma cláusula abusiva?' // Opcional
  })
})

const data = await response.json()
console.log(data.analysis) // Análise do documento
```

### 4. Personalização

Você pode modificar o prompt do sistema em `lib/openai.ts`:

```typescript
export const SINDICO_AI_SYSTEM_PROMPT = `
Personalize o comportamento da IA aqui...
`
```

---

## 📊 Integração Power BI

### 1. Configurar Azure AD App

1. Acesse [portal.azure.com](https://portal.azure.com)
2. Vá em **Azure Active Directory > App registrations**
3. Clique em **New registration**
4. Preencha:
   - **Name:** CondoBI Power BI Integration
   - **Supported account types:** Single tenant
5. Após criar, anote:
   - **Application (client) ID**
   - **Directory (tenant) ID**
6. Vá em **Certificates & secrets**
7. Crie um **New client secret**
8. Copie o **Value** do secret (aparece apenas uma vez!)

### 2. Configurar Permissões Power BI

1. Ainda no app registration, vá em **API permissions**
2. Clique em **Add a permission**
3. Selecione **Power BI Service**
4. Adicione as permissões:
   - `Report.Read.All`
   - `Dataset.Read.All`
   - `Workspace.Read.All`
5. Clique em **Grant admin consent**

### 3. Obter IDs do Power BI

1. Acesse [app.powerbi.com](https://app.powerbi.com)
2. Abra seu workspace
3. Na URL, copie o **Workspace ID**:
   `https://app.powerbi.com/groups/{WORKSPACE_ID}/...`
4. Abra um relatório
5. Copie o **Report ID** da URL:
   `https://app.powerbi.com/...reports/{REPORT_ID}/...`

### 4. Configurar Variáveis

```env
POWERBI_CLIENT_ID=seu-client-id-azure
POWERBI_CLIENT_SECRET=seu-client-secret
POWERBI_TENANT_ID=seu-tenant-id
POWERBI_WORKSPACE_ID=seu-workspace-id
POWERBI_REPORT_ID=seu-report-id
```

### 5. Configurar no Banco de Dados

Após criar um condomínio, adicione a configuração do Power BI:

```typescript
await prisma.powerBIConfig.create({
  data: {
    condominioId: 'id-do-condominio',
    workspaceId: 'workspace-id',
    reportId: 'report-id',
    datasetId: 'dataset-id', // Opcional
    embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}`
  }
})
```

### 6. Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/powerbi/embed` | GET | Obter configuração de embed |
| `/api/powerbi/reports` | GET | Listar relatórios do workspace |
| `/api/powerbi/refresh` | POST | Atualizar dataset |

**Exemplo de embed:**
```javascript
const response = await fetch('/api/powerbi/embed', {
  credentials: 'include'
})

const embedConfig = await response.json()

// Usar com powerbi-client
const powerbi = new pbi.service.Service(
  pbi.factories.hpmFactory,
  pbi.factories.wpmpFactory,
  pbi.factories.routerFactory
)

const embedContainer = document.getElementById('reportContainer')

powerbi.embed(embedContainer, {
  type: 'report',
  id: embedConfig.id,
  embedUrl: embedConfig.embedUrl,
  accessToken: embedConfig.accessToken,
  tokenType: pbi.models.TokenType.Aad,
  settings: {
    panes: {
      filters: { visible: true },
      pageNavigation: { visible: true }
    }
  }
})
```

---

## 🔧 Variáveis de Ambiente

### Arquivo `.env.local` Completo

```env
# Ambiente
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://condobi_user:senha@localhost:5432/condobi

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-minimo-32-caracteres

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret

# OpenAI
OPENAI_API_KEY=sk-proj-sua-api-key

# Power BI
POWERBI_CLIENT_ID=seu-client-id-azure
POWERBI_CLIENT_SECRET=seu-client-secret-azure
POWERBI_TENANT_ID=seu-tenant-id
POWERBI_WORKSPACE_ID=seu-workspace-id
POWERBI_REPORT_ID=seu-report-id
```

---

## ✅ Testando as Integrações

### 1. Testar Banco de Dados

```bash
# Verificar conexão
npx prisma db pull

# Visualizar dados
npx prisma studio
```

### 2. Testar Autenticação

```bash
# Iniciar servidor
npm run dev

# Acessar
http://localhost:3000/api/auth/signin
```

### 3. Testar OpenAI

Criar arquivo `test-openai.js`:

```javascript
const response = await fetch('http://localhost:3000/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Olá, como você pode me ajudar?'
  })
})

console.log(await response.json())
```

### 4. Testar Power BI

```bash
curl http://localhost:3000/api/powerbi/embed \
  -H "Cookie: seu-cookie-de-sessao"
```

---

## 🚨 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

```bash
npx prisma generate
```

### Erro: "OpenAI API key not found"

Verifique se `.env.local` existe e tem a variável `OPENAI_API_KEY`

### Erro: "Power BI authentication failed"

1. Verifique se as credenciais do Azure estão corretas
2. Confirme que as permissões foram concedidas
3. Verifique se o app está no workspace do Power BI

### Erro de conexão com PostgreSQL

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Iniciar PostgreSQL
sudo systemctl start postgresql
```

---

## 📚 Recursos Adicionais

- [Documentação Prisma](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Power BI Embedded Docs](https://learn.microsoft.com/en-us/power-bi/developer/embedded/)

---

## 🆘 Suporte

**Problemas com as integrações?**

1. Verifique os logs: `npm run dev` (modo desenvolvimento)
2. Consulte a documentação oficial de cada serviço
3. Abra uma issue no repositório

---

**Última atualização:** 2025-01-18
