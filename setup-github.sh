#!/bin/bash

# Script de Configuração do GitHub para CondoBI
# Execute este script após criar seu repositório no GitHub

echo "🚀 Script de Configuração GitHub - CondoBI"
echo "=========================================="
echo ""

# Solicita o nome de usuário do GitHub
read -p "Digite seu nome de usuário do GitHub: " GITHUB_USER

# Solicita o nome do repositório
read -p "Digite o nome do repositório (padrão: condobi-project): " REPO_NAME
REPO_NAME=${REPO_NAME:-condobi-project}

echo ""
echo "📋 Configurando repositório remoto..."
echo "Repository: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""

# Remove remote origin se já existir
git remote remove origin 2>/dev/null

# Adiciona o repositório remoto
git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git

echo "✅ Repositório remoto configurado!"
echo ""
echo "📤 Enviando código para o GitHub..."
echo ""

# Tenta fazer push
if git push -u origin main; then
    echo ""
    echo "🎉 SUCESSO! Seu projeto está no GitHub!"
    echo ""
    echo "🌐 Acesse em: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
else
    echo ""
    echo "⚠️  Erro ao fazer push. Possíveis soluções:"
    echo ""
    echo "1. Certifique-se de que o repositório foi criado no GitHub"
    echo "2. Use um Personal Access Token como senha (não sua senha do GitHub)"
    echo "   - Crie em: https://github.com/settings/tokens"
    echo "   - Selecione escopo 'repo'"
    echo ""
    echo "3. Tente novamente executando:"
    echo "   git push -u origin main"
    echo ""
fi
