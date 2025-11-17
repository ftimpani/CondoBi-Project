# API Documentation - CondoBI Backend

## Índice

1. [Autenticação](#autenticação)
2. [Condomínios](#condomínios)
3. [Unidades](#unidades)
4. [Gestão Financeira](#gestão-financeira)
5. [Manutenção](#manutenção)
6. [Notificações](#notificações)

---

## Autenticação

### POST `/api/auth/register`

Registra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "cpf": "12345678900" // opcional
}
```

**Response:**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "cuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "USER"
  }
}
```

### POST `/api/auth/signin`

Login do usuário (via NextAuth).

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

---

## Condomínios

### GET `/api/condominiums`

Lista todos os condomínios do usuário.

**Query Parameters:**
- `page`: número da página (default: 1)
- `limit`: itens por página (default: 10)
- `search`: busca por nome ou CNPJ

**Response:**
```json
{
  "condominiums": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### POST `/api/condominiums`

Cria um novo condomínio (apenas ADMIN).

**Body:**
```json
{
  "name": "Condomínio Residencial ABC",
  "cnpj": "12345678000190",
  "address": "Rua das Flores, 123",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "phone": "+5511999999999",
  "email": "contato@condabc.com.br",
  "totalUnits": 100
}
```

### GET `/api/condominiums/[id]`

Busca detalhes de um condomínio específico.

**Response:**
```json
{
  "condominium": {
    "id": "cuid",
    "name": "Condomínio ABC",
    "address": "...",
    "users": [...],
    "buildings": [...],
    "units": [...],
    "_count": {
      "units": 100,
      "expenses": 50,
      "revenues": 30
    }
  }
}
```

### PUT `/api/condominiums/[id]`

Atualiza um condomínio.

**Body:** (todos os campos são opcionais)
```json
{
  "name": "Novo Nome",
  "phone": "+5511988888888",
  "active": true
}
```

### DELETE `/api/condominiums/[id]`

Desativa um condomínio (soft delete).

---

## Unidades

### GET `/api/units`

Lista unidades de um condomínio.

**Query Parameters:**
- `condominiumId`: ID do condomínio (obrigatório)
- `buildingId`: filtrar por prédio
- `type`: filtrar por tipo (APARTMENT, HOUSE, COMMERCIAL, PARKING, STORAGE)
- `page`: número da página
- `limit`: itens por página

**Response:**
```json
{
  "units": [
    {
      "id": "cuid",
      "number": "101",
      "floor": 1,
      "type": "APARTMENT",
      "area": 85.5,
      "fraction": 1.2,
      "owner": {
        "name": "João Silva",
        "email": "joao@example.com"
      },
      "building": {
        "name": "Bloco A"
      }
    }
  ],
  "pagination": {...}
}
```

### POST `/api/units`

Cria uma nova unidade.

**Body:**
```json
{
  "condominiumId": "cuid",
  "buildingId": "cuid", // opcional
  "number": "101",
  "floor": 1,
  "type": "APARTMENT",
  "area": 85.5,
  "fraction": 1.2
}
```

---

## Gestão Financeira

### Despesas

#### GET `/api/expenses`

Lista despesas de um condomínio.

**Query Parameters:**
- `condominiumId`: ID do condomínio (obrigatório)
- `status`: PENDING, PAID, OVERDUE, CANCELLED
- `category`: MAINTENANCE, CLEANING, SECURITY, etc.
- `startDate`: data inicial
- `endDate`: data final

**Response:**
```json
{
  "expenses": [...],
  "pagination": {...},
  "totals": {
    "total": 50000.00,
    "paid": 30000.00,
    "pending": 20000.00
  }
}
```

#### POST `/api/expenses`

Cria uma nova despesa.

**Body:**
```json
{
  "condominiumId": "cuid",
  "category": "MAINTENANCE",
  "description": "Manutenção do elevador",
  "amount": 5000.00,
  "dueDate": "2025-12-31",
  "supplierId": "cuid", // opcional
  "contractId": "cuid", // opcional
  "notes": "Observações adicionais"
}
```

### Receitas

#### GET `/api/revenues`

Lista receitas de um condomínio.

**Query Parameters:**
- `condominiumId`: ID do condomínio (obrigatório)
- `category`: CONDOMINIUM_FEE, RESERVE_FUND, RENTAL, EVENT, FINES, OTHER
- `startDate`: data inicial
- `endDate`: data final

#### POST `/api/revenues`

Cria uma nova receita.

**Body:**
```json
{
  "condominiumId": "cuid",
  "category": "CONDOMINIUM_FEE",
  "description": "Taxa condominial - Dezembro 2025",
  "amount": 10000.00,
  "receivedDate": "2025-12-10"
}
```

### Cobranças

#### GET `/api/charges`

Lista cobranças.

**Query Parameters:**
- `condominiumId`: ID do condomínio
- `unitId`: ID da unidade
- `month`: mês (1-12)
- `year`: ano
- `status`: PENDING, PAID, OVERDUE, CANCELLED

**Response:**
```json
{
  "charges": [
    {
      "id": "cuid",
      "month": 12,
      "year": 2025,
      "amount": 500.00,
      "dueDate": "2025-12-10",
      "status": "PENDING",
      "unit": {
        "number": "101",
        "owner": {
          "name": "João Silva"
        }
      }
    }
  ],
  "totals": {
    "total": 50000.00,
    "paid": 35000.00,
    "pending": 15000.00
  }
}
```

#### POST `/api/charges`

Cria cobranças para todas as unidades de um condomínio.

**Body:**
```json
{
  "condominiumId": "cuid",
  "month": 12,
  "year": 2025,
  "baseAmount": 500.00,
  "dueDay": 10
}
```

**Response:**
```json
{
  "message": "100 cobranças criadas com sucesso",
  "count": 100
}
```

---

## Manutenção

### GET `/api/maintenance`

Lista solicitações de manutenção.

**Query Parameters:**
- `condominiumId`: ID do condomínio (obrigatório)
- `status`: OPEN, IN_PROGRESS, RESOLVED, CANCELLED
- `priority`: LOW, MEDIUM, HIGH, URGENT
- `category`: PLUMBING, ELECTRICAL, CLEANING, etc.

**Response:**
```json
{
  "requests": [
    {
      "id": "cuid",
      "title": "Vazamento no banheiro",
      "description": "Há um vazamento na torneira",
      "category": "PLUMBING",
      "priority": "HIGH",
      "status": "OPEN",
      "unit": {
        "number": "101"
      },
      "createdAt": "2025-11-17T10:00:00Z"
    }
  ]
}
```

### POST `/api/maintenance`

Cria uma solicitação de manutenção.

**Body:**
```json
{
  "condominiumId": "cuid",
  "unitId": "cuid", // opcional
  "title": "Vazamento no banheiro",
  "description": "Descrição detalhada do problema",
  "category": "PLUMBING",
  "priority": "HIGH"
}
```

---

## Notificações

### GET `/api/notifications`

Lista notificações do usuário.

**Query Parameters:**
- `page`: número da página
- `limit`: itens por página
- `unreadOnly`: true/false

**Response:**
```json
{
  "notifications": [
    {
      "id": "cuid",
      "title": "Nova Solicitação de Manutenção",
      "message": "Vazamento no banheiro - PLUMBING",
      "type": "INFO",
      "read": false,
      "createdAt": "2025-11-17T10:00:00Z"
    }
  ],
  "unreadCount": 5
}
```

### PUT `/api/notifications`

Marca notificações como lidas.

**Body:**
```json
{
  "notificationIds": ["cuid1", "cuid2", "cuid3"]
}
```

---

## Status Codes

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Requisição inválida
- `401`: Não autenticado
- `403`: Sem permissão
- `404`: Não encontrado
- `405`: Método não permitido
- `500`: Erro interno do servidor

---

## Autenticação

Todas as rotas (exceto `/api/auth/register`) requerem autenticação via NextAuth.

Para autenticar, faça login em `/api/auth/signin` e o NextAuth gerenciará automaticamente a sessão via cookies.

---

## Modelos de Dados

### Enumerações

**UserRole:**
- ADMIN
- MANAGER
- SYNDIC
- USER
- RESIDENT

**CondominiumRole:**
- ADMIN
- SYNDIC
- COUNCIL_MEMBER
- RESIDENT
- VIEWER

**UnitType:**
- APARTMENT
- HOUSE
- COMMERCIAL
- PARKING
- STORAGE

**ExpenseCategory:**
- MAINTENANCE
- CLEANING
- SECURITY
- ELECTRICITY
- WATER
- GAS
- INSURANCE
- ADMINISTRATION
- LEGAL
- REPAIR
- OTHER

**RevenueCategory:**
- CONDOMINIUM_FEE
- RESERVE_FUND
- RENTAL
- EVENT
- FINES
- OTHER

**PaymentStatus:**
- PENDING
- PAID
- OVERDUE
- CANCELLED

**MaintenanceCategory:**
- PLUMBING
- ELECTRICAL
- CLEANING
- ELEVATOR
- PAINTING
- CARPENTRY
- GARDENING
- SECURITY
- OTHER

**Priority:**
- LOW
- MEDIUM
- HIGH
- URGENT

**MaintenanceStatus:**
- OPEN
- IN_PROGRESS
- RESOLVED
- CANCELLED

**NotificationType:**
- INFO
- WARNING
- ALERT
- SUCCESS
