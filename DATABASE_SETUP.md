# Configuração do Banco de Dados

## Pré-requisitos

- PostgreSQL instalado (versão 12 ou superior)
- Node.js 18+ e npm 9+

## Passo 1: Instalar PostgreSQL

### No Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### No macOS:
```bash
brew install postgresql
brew services start postgresql
```

### No Windows:
Baixe e instale o PostgreSQL do site oficial: https://www.postgresql.org/download/windows/

## Passo 2: Criar o Banco de Dados

```bash
# Conectar ao PostgreSQL como usuário postgres
sudo -u postgres psql

# Dentro do psql, execute:
CREATE DATABASE condobi;
CREATE USER condobi_user WITH ENCRYPTED PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE condobi TO condobi_user;

# Sair do psql
\q
```

## Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e configure a conexão do banco de dados:

```env
# Database
DATABASE_URL="postgresql://condobi_user:sua_senha_segura@localhost:5432/condobi"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-key-minimo-32-caracteres-aqui

# Node
NODE_ENV=development
```

## Passo 4: Gerar o Prisma Client

```bash
npm run db:generate
```

## Passo 5: Executar as Migrations

### Opção A: Criar e aplicar migrations (recomendado para produção)
```bash
npm run db:migrate
```

Isso criará um diretório `prisma/migrations` com o histórico de todas as alterações do schema.

### Opção B: Push direto (rápido para desenvolvimento)
```bash
npm run db:push
```

Isso aplicará as alterações diretamente no banco sem criar arquivos de migration.

## Passo 6: (Opcional) Popular o Banco com Dados de Teste

Você pode criar um arquivo de seed para popular o banco com dados iniciais:

```bash
npm run db:seed
```

## Passo 7: Visualizar o Banco de Dados

O Prisma Studio é uma interface visual para o banco de dados:

```bash
npm run db:studio
```

Isso abrirá o Prisma Studio em http://localhost:5555

## Scripts Disponíveis

- `npm run db:generate` - Gera o Prisma Client
- `npm run db:push` - Aplica alterações do schema diretamente no banco
- `npm run db:migrate` - Cria e aplica migrations
- `npm run db:migrate:deploy` - Aplica migrations em produção
- `npm run db:studio` - Abre o Prisma Studio
- `npm run db:seed` - Popula o banco com dados de teste

## Estrutura do Banco de Dados

O banco de dados inclui as seguintes tabelas principais:

### Autenticação e Usuários
- `users` - Usuários do sistema
- `accounts` - Contas vinculadas (OAuth, etc)
- `sessions` - Sessões ativas
- `verification_tokens` - Tokens de verificação

### Condomínios
- `condominiums` - Dados dos condomínios
- `user_condominiums` - Relação usuário-condomínio com permissões
- `buildings` - Prédios/blocos
- `units` - Unidades (apartamentos, casas, etc)

### Gestão Financeira
- `expenses` - Despesas do condomínio
- `revenues` - Receitas
- `charges` - Cobranças mensais por unidade
- `suppliers` - Fornecedores
- `contracts` - Contratos com fornecedores

### Assembleias e Documentos
- `assemblies` - Assembleias
- `votes` - Votos das assembleias
- `documents` - Documentos do condomínio

### Manutenção
- `maintenance_requests` - Solicitações de manutenção

### Sistema
- `notifications` - Notificações
- `audit_logs` - Log de auditoria

## Backup e Restore

### Criar Backup:
```bash
pg_dump -U condobi_user -d condobi -f backup.sql
```

### Restaurar Backup:
```bash
psql -U condobi_user -d condobi -f backup.sql
```

## Troubleshooting

### Erro de conexão com o banco de dados

Se você receber um erro de conexão, verifique:

1. O PostgreSQL está rodando: `sudo systemctl status postgresql`
2. A DATABASE_URL no `.env.local` está correta
3. O usuário e senha estão corretos
4. O firewall não está bloqueando a porta 5432

### Erro de permissão

Se houver erro de permissão, execute:

```sql
sudo -u postgres psql
\c condobi
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO condobi_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO condobi_user;
```

### Resetar o banco de dados

**ATENÇÃO: Isso irá apagar todos os dados!**

```bash
npx prisma migrate reset
```

## Ambientes de Produção

Para deploy em produção, considere usar serviços gerenciados de PostgreSQL:

- **Vercel Postgres** (recomendado para Next.js)
- **Supabase** (PostgreSQL + funcionalidades adicionais)
- **AWS RDS**
- **Digital Ocean Managed Databases**
- **Heroku Postgres**

Configure a `DATABASE_URL` de produção nas variáveis de ambiente do seu provedor de hosting.
