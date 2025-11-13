# 📱 CondoBI Mobile - Guia de Desenvolvimento

**Status:** Planejamento (aguardando validação da versão web)

---

## 🎯 Visão Geral

Após validar a aplicação web, criaremos versões nativas para iOS e Android usando **React Native** com **Expo** para máxima compatibilidade e produtividade.

---

## 🛠️ Stack Tecnológica Planejada

### Frontend Mobile
- **React Native** - Framework cross-platform
- **Expo** - Ferramentas e serviços
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação
- **Styled Components** ou **NativeWind** (Tailwind para RN)
- **Lucide React Native** - Ícones

### Compartilhamento com Web
- **Shared Business Logic** - Hooks e serviços
- **API Routes** - Next.js API routes como backend
- **Design System** - Componentes reutilizáveis

---

## 📂 Estrutura Proposta

```
CondoBi-Project/
├── web/                    # Next.js (atual)
│   ├── pages/
│   ├── components/
│   └── ...
├── mobile/                 # React Native (futuro)
│   ├── App.tsx
│   ├── app.json
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   └── services/
│   └── package.json
├── shared/                 # Código compartilhado
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── constants/
└── api/                   # Backend (Next.js API)
    └── ...
```

---

## 🚀 Roadmap Mobile

### Fase 1: Setup (1-2 semanas)
- [ ] Criar projeto Expo
- [ ] Configurar TypeScript
- [ ] Setup de navegação
- [ ] Estrutura de pastas
- [ ] Configurar ambiente de desenvolvimento

### Fase 2: Autenticação (1 semana)
- [ ] Tela de login
- [ ] Tela de cadastro
- [ ] Recuperação de senha
- [ ] Persistência de sessão
- [ ] Integração com API

### Fase 3: Dashboard (2 semanas)
- [ ] Home com métricas
- [ ] Cards de KPIs
- [ ] Gráficos (react-native-chart-kit ou Victory)
- [ ] Pull to refresh
- [ ] Notificações push

### Fase 4: Funcionalidades Core (3-4 semanas)
- [ ] Gestão financeira
- [ ] Visualização de boletos
- [ ] Upload/visualização de documentos
- [ ] Chat com IA
- [ ] Calendário de eventos
- [ ] Perfil de usuário

### Fase 5: Features Avançadas (2-3 semanas)
- [ ] Pagamento PIX in-app
- [ ] Câmera para documentos
- [ ] Notificações push
- [ ] Modo offline
- [ ] Sincronização

### Fase 6: Publicação (1-2 semanas)
- [ ] Testes em dispositivos reais
- [ ] Build de produção
- [ ] App Store submission
- [ ] Google Play submission
- [ ] Review e aprovação

---

## 📦 Instalação (Quando Implementar)

### Pré-requisitos

```bash
# Node.js >= 18
node --version

# Expo CLI
npm install -g expo-cli

# iOS (macOS apenas)
# Xcode via App Store

# Android
# Android Studio
```

### Criar Projeto

```bash
# Criar projeto Expo
npx create-expo-app mobile --template expo-template-blank-typescript

# Navegar para pasta
cd mobile

# Instalar dependências
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install lucide-react-native
npm install axios react-query

# Rodar
npm start
```

---

## 🔌 Integração com Backend

### API Routes Next.js

Criar endpoints no Next.js para o mobile consumir:

```typescript
// pages/api/auth/login.ts
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body
    // Autenticar usuário
    // Retornar token JWT
  }
}

// pages/api/condominio/[id].ts
export default async function handler(req, res) {
  const { id } = req.query
  // Buscar dados do condomínio
  // Retornar JSON
}
```

### Consumir no Mobile

```typescript
// mobile/src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL || 'https://condobi.vercel.app/api'
})

export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export const getCondominio = async (id: string) => {
  const { data } = await api.get(`/condominio/${id}`)
  return data
}
```

---

## 🎨 Design Mobile

### Diferenças do Web

1. **Navegação:** Bottom tabs + Stack navigator
2. **Gestos:** Swipe, pull-to-refresh
3. **Notificações:** Push notifications
4. **Câmera:** Acesso nativo
5. **Biometria:** Face ID / Touch ID
6. **Offline:** Modo offline com sincronização

### Telas Principais

1. **Login/Cadastro**
2. **Home** - Dashboard com métricas
3. **Financeiro** - Boletos e pagamentos
4. **Documentos** - Lista e visualização
5. **Chat IA** - Assistente virtual
6. **Notificações** - Central de avisos
7. **Perfil** - Configurações do usuário

---

## 🚀 Deploy Mobile

### iOS (App Store)

**Requisitos:**
- Conta Apple Developer ($99/ano)
- MacBook com Xcode
- Certificados e provisioning profiles

**Processo:**
```bash
# Build iOS
eas build --platform ios

# Submit para App Store
eas submit --platform ios
```

### Android (Google Play)

**Requisitos:**
- Conta Google Play Console ($25 taxa única)
- Keystore configurado

**Processo:**
```bash
# Build Android
eas build --platform android

# Submit para Google Play
eas submit --platform android
```

---

## 🧪 Testes

### Testes Locais

```bash
# iOS Simulator (macOS)
npm run ios

# Android Emulator
npm run android

# Expo Go (dispositivo físico)
npm start
# Escanear QR code no app Expo Go
```

### TestFlight / Internal Testing

- **iOS:** TestFlight (beta testing)
- **Android:** Internal testing track

---

## 📊 Features Mobile-Specific

### Notificações Push

```typescript
// Usando Expo Notifications
import * as Notifications from 'expo-notifications'

// Registrar para notificações
const token = await Notifications.getExpoPushTokenAsync()

// Enviar do backend
await sendPushNotification(token, {
  title: 'Novo Boleto',
  body: 'Você tem um boleto vencendo amanhã'
})
```

### Biometria

```typescript
// Usando Expo LocalAuthentication
import * as LocalAuthentication from 'expo-local-authentication'

const result = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Autentique para acessar'
})
```

### Câmera

```typescript
// Usando Expo Camera
import { Camera } from 'expo-camera'

// Tirar foto de documento
const photo = await cameraRef.current.takePictureAsync()
```

---

## 💰 Custo de Publicação

| Plataforma | Custo |
|------------|-------|
| **App Store (iOS)** | $99/ano |
| **Google Play (Android)** | $25 (taxa única) |
| **Total primeiro ano** | $124 |
| **Anos seguintes** | $99/ano |

---

## 📈 Métricas de Sucesso

### KPIs Mobile
- Downloads totais
- Usuários ativos diários (DAU)
- Usuários ativos mensais (MAU)
- Taxa de retenção (D1, D7, D30)
- Crash-free rate (>99%)
- Rating nas lojas (>4.5 ⭐)

---

## 🔐 Segurança Mobile

### Boas Práticas
- ✅ Armazenar tokens em SecureStore
- ✅ Usar HTTPS apenas
- ✅ Implementar certificate pinning
- ✅ Ofuscar código (ProGuard/R8)
- ✅ Validar entradas
- ✅ Implementar rate limiting

---

## 📞 Recursos

### Documentação
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [EAS Build](https://docs.expo.dev/build/introduction/)

### Comunidade
- [React Native Community](https://github.com/react-native-community)
- [Expo Discord](https://chat.expo.dev/)

---

## 📝 Checklist Pré-Mobile

Antes de iniciar o desenvolvimento mobile:

- [ ] ✅ Web deploy validado e funcionando
- [ ] ✅ API endpoints criados no Next.js
- [ ] ✅ Design mobile aprovado
- [ ] ✅ Backend preparado para mobile
- [ ] ✅ Autenticação real implementada
- [ ] ✅ Banco de dados configurado
- [ ] ✅ Contas de desenvolvedor criadas (Apple/Google)
- [ ] ✅ Budget aprovado

---

## 🎯 Timeline Estimado

**Total:** 10-14 semanas (2.5-3.5 meses)

1. Setup: 1-2 semanas
2. Auth: 1 semana
3. Dashboard: 2 semanas
4. Features: 4 semanas
5. Polish: 2 semanas
6. Publicação: 1-2 semanas

---

**Nota:** Este documento será atualizado conforme o desenvolvimento mobile avançar.

**Status atual:** Aguardando validação da versão web ✅

---

**Última atualização:** 2025-01-13
