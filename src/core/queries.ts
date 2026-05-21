import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "@core/keys";
import { QUERY_STALE_TIME, QUERY_GC_TIME } from "@core/constants";
import { fetchItems, fetchItemById } from "@core/api/items";
import { fetchDashboardSummary } from "@core/api/dashboard";
import { fetchProfile } from "@core/api/profile";
import { fetchSettings } from "@core/api/settings";
import { fetchMe } from "@core/api/auth";
import {
  cryptoWalletApi,
  cryptoOrderApi,
  cryptoMarketplaceApi,
  cryptoTransactionApi,
  cryptoRateApi,
} from "@core/api/crypto";
import type { MarketplaceFiltersOutput } from "@core/schemas/crypto";

export const authMeQueryOptions = queryOptions({
  queryKey: queryKeys.auth.me.queryKey,
  queryFn: ({ signal }) => fetchMe(signal),
  staleTime: QUERY_STALE_TIME,
  gcTime: QUERY_GC_TIME,
});

export const itemsQueryOptions = (filters?: { search?: string; page?: number }) =>
  queryOptions({
    queryKey: queryKeys.items.list(filters).queryKey,
    queryFn: ({ signal }) => fetchItems({ ...filters, signal }),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    placeholderData: (prev) => prev,
  });

export const itemByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: queryKeys.items.detail(id).queryKey,
    queryFn: ({ signal }) => fetchItemById(id, signal),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    enabled: Boolean(id),
  });

export const dashboardSummaryQueryOptions = queryOptions({
  queryKey: queryKeys.dashboard.summary.queryKey,
  queryFn: ({ signal }) => fetchDashboardSummary(signal),
  staleTime: QUERY_STALE_TIME,
  gcTime: QUERY_GC_TIME,
});

export const profileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: queryKeys.profile.detail(userId).queryKey,
    queryFn: ({ signal }) => fetchProfile(userId, signal),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    enabled: Boolean(userId),
  });

export const settingsQueryOptions = queryOptions({
  queryKey: queryKeys.settings.all.queryKey,
  queryFn: ({ signal }) => fetchSettings(signal),
  staleTime: QUERY_STALE_TIME,
  gcTime: QUERY_GC_TIME,
});

// ==================== CRYPTO QUERIES ====================

export const cryptoWalletsQueryOptions = queryOptions({
  queryKey: queryKeys.cryptoWallets.all.queryKey,
  queryFn: () => cryptoWalletApi.listWallets(),
  staleTime: QUERY_STALE_TIME,
  gcTime: QUERY_GC_TIME,
});

export const cryptoWalletByIdQueryOptions = (walletId: string) =>
  queryOptions({
    queryKey: queryKeys.cryptoWallets.detail(walletId).queryKey,
    queryFn: () => cryptoWalletApi.getWallet(walletId),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    enabled: Boolean(walletId),
  });

export const cryptoWalletAddressesQueryOptions = (walletId: string) =>
  queryOptions({
    queryKey: queryKeys.cryptoWallets.addresses(walletId).queryKey,
    queryFn: () => cryptoWalletApi.listWalletAddresses(walletId),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    enabled: Boolean(walletId),
  });

export const cryptoMyOrdersQueryOptions = (filters?: Record<string, string>) =>
  queryOptions({
    queryKey: queryKeys.cryptoOrders.my(filters).queryKey,
    queryFn: () => cryptoOrderApi.listMyOrders(filters),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    placeholderData: (prev) => prev,
  });

export const cryptoOrderByIdQueryOptions = (orderId: string) =>
  queryOptions({
    queryKey: queryKeys.cryptoOrders.detail(orderId).queryKey,
    queryFn: () => cryptoOrderApi.getOrder(orderId),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    enabled: Boolean(orderId),
  });

export const cryptoMarketplaceOffersQueryOptions = (filters?: MarketplaceFiltersOutput) =>
  queryOptions({
    queryKey: queryKeys.cryptoMarketplace.offers(filters as Record<string, string>).queryKey,
    queryFn: () => cryptoMarketplaceApi.listOffers(filters),
    staleTime: 30000,
    gcTime: QUERY_GC_TIME,
    placeholderData: (prev) => prev,
  });

export const cryptoMarketplaceOfferQueryOptions = (orderId: string) =>
  queryOptions({
    queryKey: queryKeys.cryptoMarketplace.detail(orderId).queryKey,
    queryFn: () => cryptoMarketplaceApi.getOffer(orderId),
    staleTime: 30000,
    gcTime: QUERY_GC_TIME,
    enabled: Boolean(orderId),
  });

export const cryptoMyTransactionsQueryOptions = (filters?: Record<string, string>) =>
  queryOptions({
    queryKey: queryKeys.cryptoTransactions.my(filters).queryKey,
    queryFn: () => cryptoTransactionApi.listMyTransactions(filters),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    placeholderData: (prev) => prev,
  });

export const cryptoTransactionByIdQueryOptions = (transactionId: string) =>
  queryOptions({
    queryKey: queryKeys.cryptoTransactions.detail(transactionId).queryKey,
    queryFn: () => cryptoTransactionApi.getTransaction(transactionId),
    staleTime: 10000,
    gcTime: QUERY_GC_TIME,
    enabled: Boolean(transactionId),
  });

export const cryptoCurrentRateQueryOptions = (crypto: 'BTC' | 'USDT', currency: 'USD' | 'BRL') =>
  queryOptions({
    queryKey: queryKeys.cryptoRates.current(crypto, currency).queryKey,
    queryFn: () => cryptoRateApi.getCurrentRate(crypto, currency),
    staleTime: 60000,
    gcTime: QUERY_GC_TIME,
  });

export const cryptoRateHistoryQueryOptions = (crypto: 'BTC' | 'USDT', currency: 'USD' | 'BRL', days: number = 7) =>
  queryOptions({
    queryKey: queryKeys.cryptoRates.history(crypto, currency, days).queryKey,
    queryFn: () => cryptoRateApi.getRateHistory(crypto, currency, days),
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
  });
