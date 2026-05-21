# Backend API - Plataforma OTC Cripto

## Base URL
```
https://api.otc-crypto.example.com/api
```

## Autenticação
Todos os endpoints (exceto `/auth/*`) requerem:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
Accept-Language: pt-BR
```

---

## 📋 Wallets API

### `GET /crypto/wallets`
Lista todas as carteiras do usuário autenticado.

**Response:** `200 OK`
```json
[
  {
    "id": "wallet_123",
    "userId": "user_456",
    "crypto": "BTC",
    "blockchain": "bitcoin",
    "address": "1A1z7agoat...",
    "balance": "100000000",
    "balanceFormatted": "1.00 BTC",
    "isVerified": true,
    "createdAt": "2026-05-20T10:00:00Z",
    "updatedAt": "2026-05-20T10:00:00Z"
  }
]
```

### `POST /crypto/wallets`
Cria uma nova carteira para o usuário.

**Request:**
```json
{
  "crypto": "BTC",
  "blockchain": "bitcoin",
  "address": "1A1z7agoat..."
}
```

**Response:** `201 Created` - Wallet object

### `GET /crypto/wallets/:walletId`
Obtém detalhes de uma carteira específica.

**Response:** `200 OK` - Wallet object

### `POST /crypto/wallets/:walletId/addresses`
Adiciona um novo endereço a uma carteira.

**Request:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f42fB2"
}
```

**Response:** `201 Created`
```json
{
  "id": "addr_789",
  "walletId": "wallet_123",
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f42fB2",
  "blockchain": "ethereum",
  "isVerified": false,
  "createdAt": "2026-05-20T10:00:00Z"
}
```

### `GET /crypto/wallets/:walletId/addresses`
Lista todos os endereços de uma carteira.

**Response:** `200 OK` - Array of WalletAddress objects

### `POST /crypto/wallets/:walletId/addresses/:addressId/verify`
Verifica propriedade do endereço via assinatura.

**Request:**
```json
{
  "signature": "0x1234abcd..."
}
```

**Response:** `200 OK` - WalletAddress object com `isVerified: true`

---

## 📊 Orders API

### `GET /crypto/orders`
Lista as ofertas do usuário autenticado.

**Query params:**
- `status` - Filter: `open`, `matched`, `completed`, `cancelled`
- `crypto` - Filter: `BTC`, `USDT`
- `type` - Filter: `buy`, `sell`
- `page` - Paginação
- `limit` - Itens por página

**Response:** `200 OK`
```json
[
  {
    "id": "order_123",
    "userId": "user_456",
    "type": "buy",
    "crypto": "BTC",
    "amount": "100000000",
    "pricePerUnit": "45000",
    "totalPrice": "45000",
    "currency": "USD",
    "status": "open",
    "expiresAt": "2026-05-27T10:00:00Z",
    "createdAt": "2026-05-20T10:00:00Z",
    "updatedAt": "2026-05-20T10:00:00Z"
  }
]
```

### `POST /crypto/orders`
Cria uma nova oferta (buy ou sell).

**Request:**
```json
{
  "type": "buy",
  "crypto": "BTC",
  "amount": "100000000",
  "pricePerUnit": "45000",
  "currency": "USD",
  "expiresAtMinutes": 120
}
```

**Response:** `201 Created` - Order object

### `GET /crypto/orders/:orderId`
Obtém detalhes de uma oferta.

**Response:** `200 OK` - Order object

### `PUT /crypto/orders/:orderId`
Atualiza uma oferta (quantidade, preço, expiração).

**Request:**
```json
{
  "amount": "200000000",
  "pricePerUnit": "46000",
  "expiresAtMinutes": 180
}
```

**Response:** `200 OK` - Order object atualizado

### `PUT /crypto/orders/:orderId/cancel`
Cancela uma oferta.

**Response:** `200 OK` - Order object com `status: "cancelled"`

---

## 🛒 Marketplace API

### `GET /crypto/marketplace`
Lista ofertas disponíveis de outros usuários.

**Query params:**
- `crypto` - Filter: `BTC`, `USDT`
- `type` - Filter: `buy`, `sell` (ofertas de venda se quer comprar)
- `minPrice` - Valor mínimo
- `maxPrice` - Valor máximo
- `minAmount` - Quantidade mínima
- `maxAmount` - Quantidade máxima
- `currency` - Filter: `USD`, `BRL`
- `sortBy` - `price_asc`, `price_desc`, `amount_asc`, `amount_desc`, `newest`
- `page` - Paginação

**Response:** `200 OK`
```json
[
  {
    "id": "order_789",
    "order": { /* Order object */ },
    "seller": {
      "id": "user_999",
      "name": "João Silva",
      "avatar": "https://...",
      "rating": 4.8,
      "completedTrades": 42
    }
  }
]
```

### `GET /crypto/marketplace/:orderId`
Obtém detalhes de uma oferta com informações do vendedor.

**Response:** `200 OK` - MarketplaceOffer object

---

## 💰 Transactions API

### `POST /crypto/transactions`
Aceita uma oferta e cria uma transação.

**Request:**
```json
{
  "orderId": "order_123",
  "walletId": "wallet_456"
}
```

**Response:** `201 Created`
```json
{
  "id": "tx_999",
  "orderId": "order_123",
  "buyerId": "user_111",
  "sellerId": "user_222",
  "crypto": "BTC",
  "blockchain": "bitcoin",
  "amount": "100000000",
  "pricePerUnit": "45000",
  "totalPrice": "45000",
  "currency": "USD",
  "status": "pending",
  "buyerWalletAddress": "0x111...",
  "sellerWalletAddress": "0x222...",
  "createdAt": "2026-05-20T10:00:00Z",
  "updatedAt": "2026-05-20T10:00:00Z"
}
```

### `GET /crypto/transactions`
Lista as transações do usuário (buy + sell).

**Query params:**
- `status` - Filter: `pending`, `confirmed`, `completed`, `failed`, `disputed`
- `crypto` - Filter: `BTC`, `USDT`
- `page` - Paginação

**Response:** `200 OK` - Array of Transaction objects

### `GET /crypto/transactions/:transactionId`
Obtém detalhes de uma transação.

**Response:** `200 OK` - Transaction object

### `PUT /crypto/transactions/:transactionId/confirm`
Comprador/Vendedor confirma envio de criptos.

**Request:**
```json
{
  "transactionHash": "0x1234abcd..." // Opcional para teste
}
```

**Response:** `200 OK` - Transaction object com `status: "confirmed"`

### `PUT /crypto/transactions/:transactionId/dispute`
Marca uma transação como disputada.

**Request:**
```json
{
  "reason": "Vendedor não enviou os criptos conforme acordado"
}
```

**Response:** `200 OK` - Transaction object com `status: "disputed"`

---

## 💹 Rates API

### `GET /crypto/rates/:crypto/:currency`
Obtém taxa de câmbio atual.

**Params:**
- `crypto` - `BTC` ou `USDT`
- `currency` - `USD` ou `BRL`

**Response:** `200 OK`
```json
{
  "rate": "45000.50",
  "updatedAt": "2026-05-20T10:15:00Z"
}
```

### `GET /crypto/rates/:crypto/:currency/history`
Obtém histórico de taxas.

**Query params:**
- `days` - Últimos N dias (default: 7)

**Response:** `200 OK`
```json
[
  {
    "date": "2026-05-20",
    "rate": "45000.50"
  },
  {
    "date": "2026-05-19",
    "rate": "44800.00"
  }
]
```

---

## 🔐 Error Handling

Todos os erros retornam no formato `application/problem+json`:

```json
{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation Error",
  "status": 400,
  "detail": "The request contains invalid data",
  "instance": "/crypto/orders",
  "errors": [
    {
      "field": "amount",
      "message": "Quantidade deve ser maior que 0"
    }
  ]
}
```

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request (validação)
- `401` - Unauthorized (sem token)
- `403` - Forbidden (sem permissão)
- `404` - Not Found
- `409` - Conflict (ex: já existe ordem para esse usuário)
- `500` - Internal Server Error

---

## 🧪 Modo Teste

Para desenvolvimento, adicione header:
```
X-Test-Mode: true
```

Isso faz a API:
- Aceitar endereços fictícios
- Não validar assinatura criptográfica
- Usar taxas fictícias
- Permitir múltiplas carteiras para teste

---

## 📱 Integração Web3

O frontend está pronto para integrar com:
- **MetaMask** - Detecta automaticamente via `window.ethereum`
- **WalletConnect** - Para carteiras móveis
- **Ledger/Trezor** - Via libraries especializadas

### Fluxo de Conexão (Frontend)
1. Usuário clica "Conectar Wallet"
2. Frontend abre MetaMask/etc
3. Usuário aprova conexão
4. Frontend obtém endereço e assina mensagem: `"Verificar propriedade do endereço ${address}"`
5. Frontend envia `POST /crypto/wallets/:walletId/addresses/:addressId/verify` com signature
6. Backend valida assinatura com `ethers.verifyMessage()`

---

## 📌 Roadmap Backend

- [ ] Implementar endpoints de wallets
- [ ] Implementar endpoints de orders
- [ ] Implementar marketplace com filtros
- [ ] Implementar transações
- [ ] Integrar webhook para confirmações blockchain
- [ ] Sistema de rating/reputação
- [ ] Sistema de disputa/arbitragem
- [ ] Integrar Stripe para depósitos fiat
- [ ] Notificações push/email
- [ ] Admin panel
