# OTC Crypto Platform - Quick Start

## 🚀 Começar Agora

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Git

### Setup Frontend

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente
cp .env.example .env.local

# 3. Iniciar servidor de desenvolvimento
npm run dev

# 4. Abrir http://localhost:5173
```

### Setup Backend (Node.js + Express)

```bash
# 1. Criar novo projeto
mkdir otc-backend
cd otc-backend

# 2. Inicializar
npm init -y

# 3. Instalar dependências
npm install express cors dotenv prisma @prisma/client jsonwebtoken bcrypt zod

# 4. Dev dependencies
npm install -D typescript ts-node @types/node

# 5. Copiar schema do arquivo CRYPTO_BACKEND_SETUP.md

# 6. Criar .env
DATABASE_URL="postgresql://user:password@localhost:5432/otc_crypto"
JWT_SECRET="your-secret-key"
JWT_EXPIRE="7d"

# 7. Setup Prisma
npx prisma init
# (Copiar schema.prisma do guia)

# 8. Migrations
npx prisma migrate dev --name init

# 9. Start
npx ts-node src/index.ts
```

---

## 📋 O que foi criado

### Frontend - Core

✅ **Types** (`src/core/types/crypto.ts`)
- `Wallet`, `Order`, `Transaction`, `MarketplaceOffer`
- `Web3Provider` para integração com MetaMask

✅ **Schemas** (`src/core/schemas/crypto.ts`)
- Validação Valibot para API
- `createWalletSchema`, `createOrderSchema`, `acceptOfferSchema`

✅ **API** (`src/core/api/crypto.ts`)
- Funções para chamar backend
- `cryptoWalletApi`, `cryptoOrderApi`, `cryptoMarketplaceApi`
- `cryptoTransactionApi`, `cryptoRateApi`

✅ **Query Keys & Options** (`src/core/keys.ts`, `src/core/queries.ts`)
- TanStack Query configuration
- Stale times e cache management

✅ **Stores** (`src/core/crypto-store.ts`)
- Zustand store para Web3 provider
- Zustand store para filtros do marketplace

✅ **Utils** (`src/core/crypto-utils.ts`)
- Formatação de quantidades
- Validação de endereços
- Conversão de unidades (satoshi ↔ BTC)

✅ **Web3 Utils** (`src/core/web3-utils.ts`)
- Integração MetaMask ready
- Assinatura de mensagens
- Listeners de eventos

✅ **Constants** (`src/core/crypto-constants.ts`)
- Blockchains suportados
- Decimals das criptos
- Confirmações necessárias

✅ **Hooks Web3** (`src/core/hooks/useWeb3.ts`)
- Hook customizado para Web3
- Conexão/desconexão de wallets

### Frontend - Features

✅ **Wallet** (`src/features/wallet/hooks.ts`)
- `useCryptoWallets()`, `useCryptoWalletById()`
- `useCreateCryptoWallet()`, `useAddWalletAddress()`
- `useVerifyWalletAddress()`

✅ **Orders** (`src/features/orders/hooks.ts`)
- `useCryptoMyOrders()`, `useCryptoOrderById()`
- `useCreateCryptoOrder()`, `useCancelCryptoOrder()`
- `useUpdateCryptoOrder()`

✅ **Marketplace** (`src/features/marketplace/hooks.ts`)
- `useCryptoMarketplaceOffers()`, `useCryptoMarketplaceOffer()`
- `useAcceptCryptoOffer()`

✅ **Transactions** (`src/features/transactions/hooks.ts`)
- `useCryptoMyTransactions()`, `useCryptoTransactionById()`
- `useConfirmCryptoTransaction()`, `useDisputeCryptoTransaction()`

✅ **Schemas** (`src/features/crypto-schemas.ts`)
- Validação Valibot para formulários
- `walletFormSchema`, `orderFormSchema`, `marketplaceSearchSchema`

### Frontend - Routes

✅ **Rotas OTC** (estrutura pronta)
- `/_main/wallet` - Minhas carteiras
- `/_main/wallet/create` - Criar carteira
- `/_main/orders` - Minhas ofertas
- `/_main/orders/create` - Criar oferta
- `/_main/marketplace` - Marketplace OTC
- `/_main/transactions` - Minhas transações

### Documentation

✅ **CRYPTO_OTC_API.md**
- Especificação completa da API REST
- Todos os endpoints com exemplos
- Status codes e error handling

✅ **CRYPTO_FRONTEND_GUIDE.md**
- Como usar os hooks
- Exemplos de implementação
- Padrões do projeto

✅ **CRYPTO_BACKEND_SETUP.md**
- Schema Prisma completo
- Exemplos de endpoints
- Fluxo de transação

---

## 🔄 Fluxo de Desenvolvimento

### 1️⃣ Backend Prioritário

```bash
1. Setup banco de dados PostgreSQL
2. Criar endpoints da API (ver CRYPTO_OTC_API.md)
3. Integrar autenticação JWT
4. Testes dos endpoints
```

### 2️⃣ Frontend - Componentes

```bash
1. Criar componentes visuais em src/features/
   - WalletList, CreateWalletForm
   - OrderList, CreateOrderForm
   - MarketplaceOffers, OfferDetail
   - TransactionList, TransactionDetail

2. Integrar com hooks existentes
3. Adicionar Web3 (MetaMask)
4. Testes com componentes
```

### 3️⃣ Integração Completa

```bash
1. Conectar frontend com backend
2. Testes E2E
3. Deploy em staging
4. Validação com usuários reais
```

---

## 🎯 Próximos Passos Imediatos

### ✨ Para Colocar em Produção

1. **Backend**
   - [ ] Setup PostgreSQL (Docker + compose.yml)
   - [ ] Implementar endpoints (express/fastify)
   - [ ] Autenticação JWT
   - [ ] Validação com Zod
   - [ ] CORS configurado

2. **Frontend**
   - [ ] Componentes das páginas
   - [ ] Integração com Web3
   - [ ] Testes
   - [ ] Build otimizado

3. **Blockchain**
   - [ ] Webhook para confirmação de transações
   - [ ] Suporte a múltiplas chains
   - [ ] Verificação de enderços

4. **DevOps**
   - [ ] Docker/Docker Compose
   - [ ] CI/CD pipeline
   - [ ] Monitoring
   - [ ] Backups

---

## 📚 Referências Úteis

- [TanStack Query Docs](https://tanstack.com/query)
- [TanStack Router Docs](https://tanstack.com/router)
- [Valibot Docs](https://valibot.dev)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Prisma Docs](https://www.prisma.io/docs)
- [Ethers.js Docs](https://docs.ethers.org)
- [MetaMask Developer Docs](https://docs.metamask.io)

---

## 🆘 Troubleshooting

### "Module not found: '@core/*'"
- Verificar path aliases em `tsconfig.json`
- Rodar `npm run build` para verificar

### "Query key mismatch"
- Certificar que está usando `useQuery(queryOptions())` e não `useQuery({ queryKey, queryFn })`

### MetaMask não conecta
- Verificar se `window.ethereum` existe
- Checar se está usando `https://` em produção
- Certificar que o header `Origin` está permitido

### Erros de validação Valibot
- Usar `safeParse` para testar schemas
- Adicionar `console.log(result.issues)` para debug

---

## 📞 Suporte

Para dúvidas sobre a implementação:
1. Consultar documentação nos arquivos `.md` criados
2. Verificar exemplos em `CRYPTO_FRONTEND_GUIDE.md`
3. Ver schema Prisma em `CRYPTO_BACKEND_SETUP.md`

---

**Status:** ✅ Frontend pronto | ⏳ Backend pendente

Bom desenvolvimento! 🚀
