# ⚡ INÍCIO RÁPIDO - Salvar no GitHub

## 🎯 Opção 1: Método Rápido (Recomendado)

### Passo 1: Criar Repositório no GitHub
1. Acesse: https://github.com/new
2. Nome: `condobi-project`
3. Descrição: "Plataforma de gestão condominial com IA"
4. Público ou Privado (você escolhe)
5. **NÃO** adicione README, .gitignore ou licença
6. Clique em **"Create repository"**

### Passo 2: Executar Script
```bash
cd condobi-project
./setup-github.sh
```

O script vai pedir:
- Seu usuário do GitHub
- Nome do repositório (pressione Enter para usar "condobi-project")

**Pronto! 🎉**

---

## 🔧 Opção 2: Método Manual

Se preferir fazer manualmente:

```bash
# 1. Entre na pasta do projeto
cd condobi-project

# 2. Conecte ao seu repositório GitHub
git remote add origin https://github.com/SEU-USUARIO/condobi-project.git

# 3. Envie para o GitHub
git push -u origin main
```

---

## 🔑 Autenticação

Quando pedir **senha**, use um **Personal Access Token**:

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Nome: "CondoBI Project"
4. Marque: ✅ **repo** (todas as opções)
5. Clique em "Generate token"
6. **COPIE o token** (só aparece uma vez!)
7. Use como senha quando Git pedir

---

## ✅ Arquivos do Projeto

```
condobi-project/
├── 📄 CondoBI_-_Landing_Page_Completa.html    (Landing page)
├── 📄 Portal_CondoBI_-_Sistema_Completo.tsx   (Portal React)
├── 📄 README.md                                (Documentação)
├── 📄 GITHUB_GUIDE.md                          (Guia detalhado)
├── 📄 package.json                             (Dependências)
├── 📄 LICENSE                                  (Licença MIT)
├── 📄 .gitignore                              (Arquivos ignorados)
├── 📄 setup-github.sh                          (Script auxiliar)
└── 📁 .git/                                    (Git inicializado ✅)
```

---

## 📚 Próximos Passos

Depois de subir no GitHub:

1. **Compartilhar:** Envie o link do repositório
2. **Documentar:** Atualize o README se necessário
3. **Desenvolver:** Continue adicionando features
4. **Commits:** Use `git add .` + `git commit -m "mensagem"` + `git push`

---

## 🆘 Problemas?

Veja o arquivo **GITHUB_GUIDE.md** para:
- Solução de problemas comuns
- Comandos Git úteis
- Convenções de commit
- Tutoriais e recursos

---

## 📞 Informações do Projeto

- **Nome:** CondoBI + SíndicoAI
- **Descrição:** Primeira plataforma de gestão condominial com IA do Brasil
- **Licença:** MIT
- **Contato:** contato@condobi.com.br

---

✨ **Seu projeto está pronto para o GitHub!**
