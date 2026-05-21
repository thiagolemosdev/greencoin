import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queryKeys = createQueryKeyStore({
  auth: {
    me: null,
  },
  items: {
    list: (filters?: { search?: string; page?: number }) => [{ filters }],
    detail: (id: string) => [{ id }],
  },
  profile: {
    detail: (userId: string) => [{ userId }],
  },
  dashboard: {
    summary: null,
    recent: (limit?: number) => [{ limit }],
  },
  settings: {
    all: null,
  },
  // Crypto — estrutura plana para compatibilidade com query-key-factory v1
  cryptoWallets: {
    all: null,
    detail: (walletId: string) => [{ walletId }],
    addresses: (walletId: string) => [{ walletId }],
  },
  cryptoOrders: {
    my: (filters?: Record<string, string>) => [{ filters }],
    detail: (orderId: string) => [{ orderId }],
  },
  cryptoMarketplace: {
    offers: (filters?: Record<string, string>) => [{ filters }],
    detail: (orderId: string) => [{ orderId }],
  },
  cryptoTransactions: {
    my: (filters?: Record<string, string>) => [{ filters }],
    detail: (transactionId: string) => [{ transactionId }],
  },
  cryptoRates: {
    current: (crypto: string, currency: string) => [{ crypto, currency }],
    history: (crypto: string, currency: string, days: number) => [{ crypto, currency, days }],
  },
});
