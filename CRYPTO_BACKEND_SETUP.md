# Backend OTC Crypto - Implementação

## 🛠 Stack Recomendado

```
Framework: Node.js + Express/NestJS/Fastify
Database: PostgreSQL
ORM: Prisma
Auth: JWT + Refresh tokens
Validation: Zod/Valibot
WebSocket: Socket.io (para notificações real-time)
Job Queue: Bull/RabbitMQ (para processar transações)
```

---

## 📊 Schema do Banco de Dados (Prisma)

```prisma
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ==================== AUTH ====================

model User {
  id                String       @id @default(cuid())
  email             String       @unique
  passwordHash      String
  name              String
  avatar            String?
  
  // Profile
  kycVerified       Boolean      @default(false)
  kycDocument       String?
  
  // Rating & Reputation
  rating            Float        @default(5.0)
  completedTrades   Int          @default(0)
  disputedTrades    Int          @default(0)
  
  // Relations
  wallets           Wallet[]
  buyOrders         Order[]      @relation("buyer")
  sellOrders        Order[]      @relation("seller")
  buyTransactions   Transaction[] @relation("buyer")
  sellTransactions  Transaction[] @relation("seller")
  
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
}

// ==================== WALLETS ====================

model Wallet {
  id                String       @id @default(cuid())
  userId            String
  user              User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  crypto            String       // BTC, USDT
  blockchain        String       // bitcoin, ethereum
  address           String       @unique
  balance           String       @default("0") // em wei/satoshi
  
  isVerified        Boolean      @default(false)
  
  addresses         WalletAddress[]
  
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
  
  @@unique([userId, crypto, blockchain])
}

model WalletAddress {
  id                String       @id @default(cuid())
  walletId          String
  wallet            Wallet       @relation(fields: [walletId], references: [id], onDelete: Cascade)
  
  address           String       @unique
  blockchain        String
  
  isVerified        Boolean      @default(false)
  verificationHash  String?
  
  createdAt         DateTime     @default(now())
}

// ==================== ORDERS ====================

model Order {
  id                String       @id @default(cuid())
  
  buyerId           String
  buyer             User         @relation("buyer", fields: [buyerId], references: [id])
  
  type              String       // buy, sell
  crypto            String       // BTC, USDT
  amount            String       // em wei/satoshi
  pricePerUnit      String       // preço em USD/BRL
  totalPrice        String       // amount * pricePerUnit
  currency          String       // USD, BRL
  
  status            String       @default("open") // open, matched, completed, cancelled
  
  expiresAt         DateTime
  
  transactions      Transaction[]
  
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
  
  @@index([buyerId])
  @@index([status])
  @@index([crypto])
}

// ==================== TRANSACTIONS ====================

model Transaction {
  id                String       @id @default(cuid())
  orderId           String
  order             Order        @relation(fields: [orderId], references: [id])
  
  buyerId           String
  buyer             User         @relation("buyer", fields: [buyerId], references: [id])
  
  sellerId          String
  seller            User         @relation("seller", fields: [sellerId], references: [id])
  
  crypto            String
  blockchain        String
  amount            String
  pricePerUnit      String
  totalPrice        String
  currency          String
  
  status            String       @default("pending") // pending, confirmed, completed, failed, disputed
  
  buyerWalletAddress   String
  sellerWalletAddress  String
  
  transactionHash   String?      // Hash na blockchain
  
  completedAt       DateTime?
  failedReason      String?
  
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
  
  @@index([buyerId])
  @@index([sellerId])
  @@index([status])
}

// ==================== RATES ====================

model CryptoRate {
  id                String       @id @default(cuid())
  
  crypto            String       // BTC, USDT
  currency          String       // USD, BRL
  rate              String
  
  createdAt         DateTime     @default(now())
  
  @@unique([crypto, currency, createdAt])
  @@index([crypto, currency])
}

// ==================== NOTIFICATIONS ====================

model Notification {
  id                String       @id @default(cuid())
  userId            String
  
  type              String       // order_accepted, transaction_confirmed, etc
  title             String
  body              String
  data              Json?        // Dados adicionais (ex: transactionId)
  
  read              Boolean      @default(false)
  
  createdAt         DateTime     @default(now())
  
  @@index([userId])
  @@index([read])
}
```

---

## 📝 Migrations

```bash
# Criar schema
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Ver schema visualmente
npx prisma studio
```

---

## 🔐 Segurança

### Headers obrigatórios
```typescript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
```

### Validação de entrada
```typescript
import { z } from 'zod';

const createOrderSchema = z.object({
  type: z.enum(['buy', 'sell']),
  crypto: z.enum(['BTC', 'USDT']),
  amount: z.string().regex(/^\d+(\.\d{1,8})?$/),
  pricePerUnit: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.enum(['USD', 'BRL']),
  expiresAtMinutes: z.number().min(5).max(10080),
});
```

### Rate limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP
});

app.use(limiter);
```

---

## 🔄 Fluxo de Transação

```
1. Usuário A cria oferta (BUY BTC por 45000 USD)
   POST /crypto/orders

2. Usuário B vê a oferta no marketplace
   GET /crypto/marketplace

3. Usuário B aceita a oferta
   POST /crypto/transactions
   Status: pending

4. Usuário A envia BTC para endereço de B
   (Via blockchain ou plataforma custodiar)

5. Usuário A confirma envio
   PUT /crypto/transactions/:id/confirm
   Status: confirmed

6. Usuário B confirma recebimento
   PUT /crypto/transactions/:id/confirm
   Status: completed
   
7. Atualizar ratings/reputação
```

---

## 📚 Estrutura Express

```typescript
// src/app.ts
import express from 'express';
import authRoutes from './routes/auth';
import walletRoutes from './routes/wallet';
import orderRoutes from './routes/order';
import marketplaceRoutes from './routes/marketplace';
import transactionRoutes from './routes/transaction';
import rateRoutes from './routes/rate';

const app = express();

app.use(express.json());
app.use(authMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/crypto/wallets', walletRoutes);
app.use('/api/crypto/orders', orderRoutes);
app.use('/api/crypto/marketplace', marketplaceRoutes);
app.use('/api/crypto/transactions', transactionRoutes);
app.use('/api/crypto/rates', rateRoutes);

export default app;
```

---

## 💾 Exemplo de Endpoint

```typescript
// src/routes/order.ts
import { Router } from 'express';
import { prisma } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /crypto/orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { buyerId: req.user.id },
      include: { transactions: true },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST /crypto/orders
router.post('/', authMiddleware, async (req, res) => {
  const { type, crypto, amount, pricePerUnit, currency, expiresAtMinutes } = req.body;
  
  try {
    // Validar dados
    // Verificar wallet existe
    // Criar order
    
    const order = await prisma.order.create({
      data: {
        buyerId: req.user.id,
        type,
        crypto,
        amount,
        pricePerUnit,
        totalPrice: (parseFloat(amount) * parseFloat(pricePerUnit)).toString(),
        currency,
        expiresAt: new Date(Date.now() + expiresAtMinutes * 60000),
      },
    });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order' });
  }
});

export default router;
```

---

## 🧪 Testes

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

---

## 🚀 Deploy

```bash
# Build
npm run build

# Start
npm start

# Com PM2
pm2 start dist/index.js --name "otc-api"
```

---

## 📝 TODO Backend

- [ ] Setup PostgreSQL
- [ ] Setup Prisma schema
- [ ] Implement Auth (JWT)
- [ ] Implement Wallets API
- [ ] Implement Orders API
- [ ] Implement Marketplace API
- [ ] Implement Transactions API
- [ ] Implement Rates API
- [ ] Webhook para confirmação blockchain
- [ ] Sistema de rating
- [ ] Sistema de disputa
- [ ] Notificações real-time (WebSocket)
- [ ] Admin panel

