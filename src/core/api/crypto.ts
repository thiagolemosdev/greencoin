import { httpResource } from '@core/http-resource';
import type {
  Wallet,
  Order,
  Transaction,
  MarketplaceOffer,
  WalletAddress,
} from '@core/types/crypto';
import type {
  CreateWalletOutput,
  CreateOrderOutput,
  AcceptOfferOutput,
  ConfirmTransactionOutput,
  MarketplaceFiltersOutput,
} from '@core/schemas/crypto';

// ==================== WALLETS ====================

export const cryptoWalletApi = {
  // Listar carteiras do usuário
  listWallets: () =>
    httpResource<Wallet[]>({
      method: 'GET',
      path: '/crypto/wallets',
    }),

  // Criar nova carteira
  createWallet: (data: CreateWalletOutput) =>
    httpResource<Wallet>({
      method: 'POST',
      path: '/crypto/wallets',
      body: data,
    }),

  // Obter detalhes de uma carteira
  getWallet: (walletId: string) =>
    httpResource<Wallet>({
      method: 'GET',
      path: `/crypto/wallets/${walletId}`,
    }),

  // Adicionar endereço a uma carteira
  addWalletAddress: (walletId: string, address: string) =>
    httpResource<WalletAddress>({
      method: 'POST',
      path: `/crypto/wallets/${walletId}/addresses`,
      body: { address },
    }),

  // Verificar endereço (prova de propriedade)
  verifyWalletAddress: (walletId: string, addressId: string, signature: string) =>
    httpResource<WalletAddress>({
      method: 'POST',
      path: `/crypto/wallets/${walletId}/addresses/${addressId}/verify`,
      body: { signature },
    }),

  // Listar endereços de uma carteira
  listWalletAddresses: (walletId: string) =>
    httpResource<WalletAddress[]>({
      method: 'GET',
      path: `/crypto/wallets/${walletId}/addresses`,
    }),
};

// ==================== ORDERS ====================

export const cryptoOrderApi = {
  // Listar minhas ofertas
  listMyOrders: (filters?: Record<string, string>) =>
    httpResource<Order[]>({
      method: 'GET',
      path: '/crypto/orders',
      params: filters,
    }),

  // Criar nova oferta
  createOrder: (data: CreateOrderOutput) =>
    httpResource<Order>({
      method: 'POST',
      path: '/crypto/orders',
      body: data,
    }),

  // Obter detalhes de uma oferta
  getOrder: (orderId: string) =>
    httpResource<Order>({
      method: 'GET',
      path: `/crypto/orders/${orderId}`,
    }),

  // Cancelar oferta
  cancelOrder: (orderId: string) =>
    httpResource<Order>({
      method: 'PUT',
      path: `/crypto/orders/${orderId}/cancel`,
    }),

  // Atualizar oferta
  updateOrder: (orderId: string, data: Partial<CreateOrderOutput>) =>
    httpResource<Order>({
      method: 'PUT',
      path: `/crypto/orders/${orderId}`,
      body: data,
    }),
};

// ==================== MARKETPLACE ====================

export const cryptoMarketplaceApi = {
  // Listar ofertas disponíveis
  listOffers: (filters?: MarketplaceFiltersOutput) =>
    httpResource<MarketplaceOffer[]>({
      method: 'GET',
      path: '/crypto/marketplace',
      params: filters as Record<string, string>,
    }),

  // Obter detalhes de uma oferta
  getOffer: (orderId: string) =>
    httpResource<MarketplaceOffer>({
      method: 'GET',
      path: `/crypto/marketplace/${orderId}`,
    }),
};

// ==================== TRANSACTIONS ====================

export const cryptoTransactionApi = {
  // Listar minhas transações
  listMyTransactions: (filters?: Record<string, string>) =>
    httpResource<Transaction[]>({
      method: 'GET',
      path: '/crypto/transactions',
      params: filters,
    }),

  // Aceitar uma oferta (cria transação)
  acceptOffer: (data: AcceptOfferOutput) =>
    httpResource<Transaction>({
      method: 'POST',
      path: '/crypto/transactions',
      body: data,
    }),

  // Obter detalhes de uma transação
  getTransaction: (transactionId: string) =>
    httpResource<Transaction>({
      method: 'GET',
      path: `/crypto/transactions/${transactionId}`,
    }),

  // Confirmar transação (envio de criptos)
  confirmTransaction: (data: ConfirmTransactionOutput) =>
    httpResource<Transaction>({
      method: 'PUT',
      path: `/crypto/transactions/${data.transactionId}/confirm`,
      body: { transactionHash: data.transactionHash },
    }),

  // Cancelar/disputar transação
  disputeTransaction: (transactionId: string, reason: string) =>
    httpResource<Transaction>({
      method: 'PUT',
      path: `/crypto/transactions/${transactionId}/dispute`,
      body: { reason },
    }),
};

// ==================== RATES ====================

export const cryptoRateApi = {
  // Obter taxa de câmbio atual
  getCurrentRate: (crypto: 'BTC' | 'USDT', currency: 'USD' | 'BRL') =>
    httpResource<{ rate: string; updatedAt: Date }>({
      method: 'GET',
      path: `/crypto/rates/${crypto}/${currency}`,
    }),

  // Obter histórico de taxas
  getRateHistory: (crypto: 'BTC' | 'USDT', currency: 'USD' | 'BRL', days: number = 7) =>
    httpResource<Array<{ date: string; rate: string }>>({
      method: 'GET',
      path: `/crypto/rates/${crypto}/${currency}/history`,
      params: { days: days.toString() },
    }),
};
