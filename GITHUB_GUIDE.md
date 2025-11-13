# 🚀 Guia: Como Subir o Projeto CondoBI no GitHub

Este guia mostra como salvar seu projeto no GitHub em poucos passos simples.

---

## 📋 Pré-requisitos

Antes de começar, você precisa:

1. ✅ Ter uma conta no GitHub (crie em [github.com](https://github.com))
2. ✅ Ter o Git instalado no seu computador ([download aqui](https://git-scm.com/))

---

## 🎯 Passo a Passo

### **Passo 1: Criar Repositório no GitHub**

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"New"** (verde) ou acesse [github.com/new](https://github.com/new)
3. Preencha os dados:
   - **Repository name:** `condobi-project` (ou o nome que preferir)
   - **Description:** "Plataforma de gestão condominial com IA"
   - Marque **"Public"** (público) ou **"Private"** (privado)
   - ❌ **NÃO** marque "Add a README file" (já temos um)
   - ❌ **NÃO** adicione .gitignore (já temos um)
   - ✅ Escolha licença **MIT** (ou deixe em branco)
4. Clique em **"Create repository"**

### **Passo 2: Inicializar Git no Projeto**

Abra o terminal/prompt de comando e execute:

```bash
# Entre na pasta do projeto
cd /caminho/para/condobi-project

# Inicialize o Git
git init

# Configure seu nome e email (primeira vez apenas)
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### **Passo 3: Adicionar Arquivos ao Git**

```bash
# Adicione todos os arquivos
git add .

# Faça o primeiro commit
git commit -m "feat: primeiro commit - landing page e portal completo"
```

### **Passo 4: Conectar ao GitHub**

Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub:

```bash
# Conecte ao repositório remoto
git remote add origin https://github.com/SEU-USUARIO/condobi-project.git

# Defina a branch principal
git branch -M main

# Envie os arquivos para o GitHub
git push -u origin main
```

### **Passo 5: Autenticação (se solicitado)**

Se pedir usuário e senha:
- **Usuário:** seu username do GitHub
- **Senha:** use um **Personal Access Token** (não a senha normal)

#### Como criar um Personal Access Token:
1. Acesse: [github.com/settings/tokens](https://github.com/settings/tokens)
2. Clique em **"Generate new token (classic)"**
3. Dê um nome: "CondoBI Project"
4. Selecione escopo: **"repo"** (marque todas as opções de repo)
5. Clique em **"Generate token"**
6. **COPIE o token** (você só verá uma vez!)
7. Use este token como senha quando Git pedir

---

## 🎉 Pronto!

Seu projeto está no GitHub! Acesse:
```
https://github.com/SEU-USUARIO/condobi-project
```

---

## 📝 Comandos Git Úteis para o Futuro

### Adicionar novas mudanças:
```bash
git add .
git commit -m "feat: descrição da mudança"
git push
```

### Ver status dos arquivos:
```bash
git status
```

### Ver histórico de commits:
```bash
git log --oneline
```

### Criar uma branch nova:
```bash
git checkout -b feature/nova-funcionalidade
```

### Voltar para a branch main:
```bash
git checkout main
```

---

## 🌟 Dicas Importantes

1. **Commits Frequentes:** Faça commits sempre que terminar uma funcionalidade
2. **Mensagens Claras:** Use mensagens descritivas nos commits
3. **Branches:** Use branches para novas features (ex: `feature/pagamento-pix`)
4. **Pull Requests:** Se trabalhar em equipe, use PRs para revisar código
5. **Backup:** GitHub serve como backup automático do seu código

---

## 📚 Convenção de Commits

Use estas tags nas mensagens de commit:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alteração em documentação
- `style:` - Mudanças de formatação/estilo
- `refactor:` - Refatoração de código
- `test:` - Adição ou modificação de testes
- `chore:` - Tarefas de manutenção

**Exemplos:**
```bash
git commit -m "feat: adicionar módulo de pagamento PIX"
git commit -m "fix: corrigir cálculo de inadimplência"
git commit -m "docs: atualizar README com instruções de instalação"
```

---

## ❓ Problemas Comuns

### "Permission denied"
- Verifique se usou o token correto como senha
- Tente usar SSH ao invés de HTTPS

### "Repository not found"
- Verifique se o nome do repositório está correto
- Confirme que você tem permissão de acesso

### "Updates were rejected"
- Execute: `git pull origin main --rebase`
- Depois: `git push origin main`

---

## 🆘 Precisa de Ajuda?

- [Documentação Git](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [Tutorial Interativo Git](https://learngitbranching.js.org/)

---

✅ **Parabéns!** Seu projeto CondoBI está seguro e versionado no GitHub!
