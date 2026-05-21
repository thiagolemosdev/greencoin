import { httpResource, defineApiRoute, defineApiRouteFn } from "@core/http-resource";
import type {
  Wallet,
  Order,
  Transaction,
  MarketplaceOffer,
  WalletAddress,
} from "@core/types/crypto";
import type {
  CreateWalletOutput,
  CreateOrderOutput,
  AcceptOfferOutput,
  ConfirmTransactionOutput,
  MarketplaceFiltersOutput,
} from "@core/schemas/crypto";

// ==================== WALLETS ====================

const walletRoutes = {
  list:     defineApiRoute("GET",    "/crypto/wallets"),
  create:   defineApiRoute("POST",   "/crypto/wallets"),
  detail:   defineApiRouteFn<{ walletId: string }>("GET",  ({ walletId }) => `/crypto/wallets/${walletId}`),
  addAddr:  defineApiRouteFn<{ walletId: string }>("POST", ({ walletId }) => `/crypto/wallets/${walletId}/addresses`),
  listAddr: defineApiRouteFn<{ walletId: string }>("GET",  ({ walletId }) => `/crypto/wallets/${walletId}/addresses`),
  verify:   defineApiRouteFn<{ walletId: string; addressId: string }>("POST", ({ walletId, addressId }) => `/crypto/wallets/${walletId}/addresses/${addressId}/verify`),
};

export const cryptoWalletApi = {
  listWallets: () =>
    httpResource<Wallet[]>(walletRoutes.list),

  createWallet: (data: CreateWalletOutput) =>
    httpResource<Wallet>(walletRoutes.create, { body: data }),

  getWallet: (walletId: string) =>
    httpResource<Wallet>(walletRoutes.detail, { params: { walletId } }),

  addWalletAddress: (walletId: string, address: string) =>
    httpResource<WalletAddress>(walletRoutes.addAddr, { params: { walletId }, body: { address } }),

  listWalletAddresses: (walletId: string) =>
    httpResource<WalletAddress[]>(walletRoutes.listAddr, { params: { walletId } }),

  verifyWalletAddress: (walletId: string, addressId: string, signature: string) =>
    httpResource<WalletAddress>(walletRoutes.verify, { params: { walletId, addressId }, body: { signature } }),
};

// ==================== ORDERS ====================

const orderRoutes = {
  list:   defineApiRoute("GET",  "/crypto/orders"),
  create: defineApiRoute("POST", "/crypto/orders"),
  detail: defineApiRouteFn<{ orderId: string }>("GET", ({ orderId }) => `/crypto/orders/${orderId}`),
  cancel: defineApiRouteFn<{ orderId: string }>("PUT", ({ orderId }) => `/crypto/orders/${orderId}/cancel`),
  update: defineApiRouteFn<{ orderId: string }>("PUT", ({ orderId }) => `/crypto/orders/${orderId}`),
};

export const cryptoOrderApi = {
  listMyOrders: (filters?: Record<string, string>) =>
    httpResource<Order[]>(orderRoutes.list, { searchParams: filters }),

  createOrder: (data: CreateOrderOutput) =>
    httpResource<Order>(orderRoutes.create, { body: data }),

  getOrder: (orderId: string) =>
    httpResource<Order>(orderRoutes.detail, { params: { orderId } }),

  cancelOrder: (orderId: string) =>
    httpResource<Order>(orderRoutes.cancel, { params: { orderId } }),

  updateOrder: (orderId: string, data: Partial<CreateOrderOutput>) =>
    httpResource<Order>(orderRoutes.update, { params: { orderId }, body: data }),
};

// ==================== MARKETPLACE ====================

const marketplaceRoutes = {
  list:   defineApiRoute("GET", "/crypto/marketplace"),
  detail: defineApiRouteFn<{ orderId: string }>("GET", ({ orderId }) => `/crypto/marketplace/${orderId}`),
};

export const cryptoMarketplaceApi = {
  listOffers: (filters?: MarketplaceFiltersOutput) =>
    httpResource<MarketplaceOffer[]>(marketplaceRoutes.list, {
      searchParams: filters as Record<string, string> | undefined,
    }),

  getOffer: (orderId: string) =>
    httpResource<MarketplaceOffer>(marketplaceRoutes.detail, { params: { orderId } }),
};

// ==================== TRANSACTIONS ====================

const txRoutes = {
  list:    defineApiRoute("GET",  "/crypto/transactions"),
  accept:  defineApiRoute("POST", "/crypto/transactions"),
  detail:  defineApiRouteFn<{ transactionId: string }>("GET", ({ transactionId }) => `/crypto/transactions/${transactionId}`),
  confirm: defineApiRouteFn<{ transactionId: string }>("PUT", ({ transactionId }) => `/crypto/transactions/${transactionId}/confirm`),
  dispute: defineApiRouteFn<{ transactionId: string }>("PUT", ({ transactionId }) => `/crypto/transactions/${transactionId}/dispute`),
};

export const cryptoTransactionApi = {
  listMyTransactions: (filters?: Record<string, string>) =>
    httpResource<Transaction[]>(txRoutes.list, { searchParams: filters }),

  acceptOffer: (data: AcceptOfferOutput) =>
    httpResource<Transaction>(txRoutes.accept, { body: data }),

  getTransaction: (transactionId: string) =>
    httpResource<Transaction>(txRoutes.detail, { params: { transactionId } }),

  confirmTransaction: (data: ConfirmTransactionOutput) =>
    httpResource<Transaction>(txRoutes.confirm, {
      params: { transactionId: data.transactionId },
      body: { transactionHash: data.transactionHash },
    }),

  disputeTransaction: (transactionId: string, reason: string) =>
    httpResource<Transaction>(txRoutes.dispute, {
      params: { transactionId },
      body: { reason },
    }),
};

// ==================== RATES ====================

const rateRoutes = {
  current: defineApiRouteFn<{ crypto: string; currency: string }>("GET", ({ crypto, currency }) => `/crypto/rates/${crypto}/${currency}`),
  history: defineApiRouteFn<{ crypto: string; currency: string }>("GET", ({ crypto, currency }) => `/crypto/rates/${crypto}/${currency}/history`),
};

export const cryptoRateApi = {
  getCurrentRate: (crypto: "BTC" | "USDT", currency: "USD" | "BRL") =>
    httpResource<{ rate: string; updatedAt: Date }>(rateRoutes.current, { params: { crypto, currency } }),

  getRateHistory: (crypto: "BTC" | "USDT", currency: "USD" | "BRL", days = 7) =>
    httpResource<Array<{ date: string; rate: string }>>(rateRoutes.history, {
      params: { crypto, currency },
      searchParams: { days },
    }),
};
