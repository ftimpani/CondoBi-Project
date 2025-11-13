# 🚀 Guia de Deploy - CondoBI

Este guia cobre o deploy completo da aplicação CondoBI em produção.

---

## 📋 Pré-requisitos

Antes de fazer o deploy, certifique-se de ter:

- ✅ Conta no GitHub (código já deve estar no repositório)
- ✅ Conta na Vercel (criar em [vercel.com](https://vercel.com))
- ✅ Node.js >= 18.0.0 instalado localmente (para desenvolvimento)
- ✅ Credenciais de APIs (OpenAI, Power BI, etc.) se aplicável

---

## 🌐 Deploy na Vercel (Recomendado)

A Vercel é a melhor opção para Next.js, oferecendo:
- Deploy automático a cada push
- HTTPS gratuito
- CDN global
- Previews de Pull Requests
- Integração perfeita com Next.js

### Passo 1: Conectar Repositório

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório **CondoBi-Project**
4. Clique em **"Import"**

### Passo 2: Configurar Build

A Vercel detecta automaticamente que é um projeto Next.js. Confirme:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Passo 3: Variáveis de Ambiente

Adicione as variáveis de ambiente necessárias:

```bash
# Ambiente
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app

# OpenAI (quando implementar)
OPENAI_API_KEY=sk-your-key

# Power BI (quando implementar)
POWERBI_CLIENT_ID=your-id
POWERBI_CLIENT_SECRET=your-secret
# ... outras variáveis do .env.example
```

### Passo 4: Deploy!

1. Clique em **"Deploy"**
2. Aguarde o build (geralmente 1-2 minutos)
3. 🎉 Seu site estará no ar em: `https://seu-projeto.vercel.app`

---

## 🔄 Deploy Contínuo

Após o primeiro deploy, a Vercel:

- ✅ Faz deploy automático a cada push na branch principal
- ✅ Cria preview para cada Pull Request
- ✅ Permite rollback instantâneo para versões anteriores
- ✅ Monitora performance e erros

---

## 🌍 Domínio Personalizado

### Adicionar Domínio Próprio

1. Vá em **Settings > Domains** no projeto Vercel
2. Adicione seu domínio (ex: `condobi.com.br`)
3. Configure os DNS conforme instruções:
   - **Tipo A:** Aponte para o IP da Vercel
   - **CNAME:** `cname.vercel-dns.com`

### Configurar SSL

A Vercel configura SSL/HTTPS automaticamente e gratuitamente via Let's Encrypt.

---

## 📊 Monitoramento

### Analytics (Opcional)

Adicione Google Analytics:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Error Tracking (Sentry)

Para monitorar erros em produção:

1. Crie conta em [sentry.io](https://sentry.io)
2. Adicione a variável:
   ```env
   SENTRY_DSN=your-sentry-dsn
   ```

---

## 🔧 Comandos Úteis

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção local
npm run build
npm start

# Verificar tipos TypeScript
npm run type-check

# Limpar e reinstalar
npm run reinstall
```

---

## 🚨 Troubleshooting

### Build Falha na Vercel

**Erro:** "Module not found"
**Solução:** Verifique se todas as dependências estão no `package.json`

```bash
npm install --save lucide-react recharts
git add .
git commit -m "fix: add missing dependencies"
git push
```

### Páginas em Branco

**Problema:** Página carrega mas fica em branco
**Solução:** Verifique o console do navegador e logs da Vercel

### Performance Lenta

**Solução:**
- Ative o cache da CDN
- Otimize imagens com `next/image`
- Use ISR (Incremental Static Regeneration) quando possível

---

## 🎯 Checklist de Deploy

Antes de considerar o deploy completo:

- [ ] Código commitado e pushed para GitHub
- [ ] Projeto conectado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy inicial concluído com sucesso
- [ ] Landing page carregando corretamente
- [ ] Portal funcionando (autenticação demo)
- [ ] Domínio personalizado configurado (opcional)
- [ ] SSL/HTTPS ativo
- [ ] Analytics configurado (opcional)
- [ ] Error tracking configurado (opcional)

---

## 📱 Próximos Passos (Mobile)

Após validar o deploy web:

1. **React Native Setup**
   - Configurar Expo ou React Native CLI
   - Compartilhar componentes com web

2. **APIs**
   - Criar API routes no Next.js
   - Implementar autenticação real
   - Conectar banco de dados

3. **Publish**
   - iOS: App Store Connect
   - Android: Google Play Console

---

## 🔐 Segurança

### Boas Práticas

- ✅ Nunca commitar `.env` ou chaves de API
- ✅ Usar variáveis de ambiente na Vercel
- ✅ Ativar autenticação de 2 fatores no GitHub/Vercel
- ✅ Revisar logs de acesso regularmente
- ✅ Manter dependências atualizadas (`npm audit`)

---

## 📞 Suporte

**Problemas com deploy?**

1. Consulte [Vercel Docs](https://vercel.com/docs)
2. Verifique [Next.js Docs](https://nextjs.org/docs)
3. Entre em contato: contato@condobi.com.br

---

## 🎉 Deploy Concluído!

Seu projeto CondoBI está no ar! 🚀

**URLs:**
- Landing Page: `https://seu-dominio.vercel.app`
- Portal: `https://seu-dominio.vercel.app/portal`

**Acesso Demo:**
- Clique em "🚀 Entrar como Demo" no portal

---

**Última atualização:** 2025-01-13
