#!/bin/bash

# Script para fazer merge e deploy do CondoBI
# Execute este script: bash merge-to-main.sh

echo "🚀 CondoBI - Merge para Main e Deploy"
echo "======================================"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar branch atual
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Branch atual: $CURRENT_BRANCH"
echo ""

# Ir para main
echo "➡️  Mudando para branch main..."
git checkout main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao mudar para main${NC}"
    exit 1
fi

# Fazer merge da branch de trabalho
echo ""
echo "🔄 Fazendo merge da branch de trabalho..."
git merge claude/extract-project-contents-011CV6Atc91xbxj3wfqGrTTC --no-edit

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no merge${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Merge concluído com sucesso!${NC}"
echo ""

# Verificar se há arquivos pages/
if [ -d "pages" ]; then
    echo -e "${GREEN}✅ Diretório pages/ encontrado${NC}"
    ls -la pages/
else
    echo -e "${RED}❌ ERRO: Diretório pages/ não encontrado!${NC}"
    exit 1
fi

echo ""
echo "📤 Tentando fazer push para main..."
echo ""

# Tentar fazer push
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 SUCESSO! Push concluído!${NC}"
    echo ""
    echo "A Vercel vai fazer deploy automaticamente em alguns instantes."
    echo "Verifique em: https://vercel.com/dashboard"
else
    echo ""
    echo -e "${YELLOW}⚠️  Push falhou (branch protegida)${NC}"
    echo ""
    echo "Você precisa criar um Pull Request no GitHub:"
    echo ""
    echo "1. Acesse: https://github.com/ftimpani/CondoBi-Project/compare/main...claude/extract-project-contents-011CV6Atc91xbxj3wfqGrTTC"
    echo ""
    echo "2. Clique em 'Create pull request'"
    echo ""
    echo "3. Faça o merge do PR"
    echo ""
    echo "OU configure a Vercel para usar a branch de trabalho:"
    echo ""
    echo "1. Acesse: https://vercel.com/dashboard"
    echo "2. Vá em Settings > Git"
    echo "3. Altere Production Branch para: claude/extract-project-contents-011CV6Atc91xbxj3wfqGrTTC"
    echo ""
fi

# Voltar para branch original
git checkout $CURRENT_BRANCH
echo ""
echo -e "${GREEN}✅ Voltou para branch: $CURRENT_BRANCH${NC}"
