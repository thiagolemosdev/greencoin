import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@core/keys';
import {
  cryptoMarketplaceOffersQueryOptions,
  cryptoMarketplaceOfferQueryOptions,
  cryptoMyTransactionsQueryOptions,
} from '@core/queries';
import { cryptoMarketplaceApi, cryptoTransactionApi } from '@core/api/crypto';
import type { MarketplaceFiltersOutput, AcceptOfferOutput } from '@core/schemas/crypto';

// ==================== QUERIES ====================

export function useCryptoMarketplaceOffers(filters?: MarketplaceFiltersOutput) {
  return useQuery(cryptoMarketplaceOffersQueryOptions(filters));
}

export function useCryptoMarketplaceOffer(orderId: string) {
  return useQuery(cryptoMarketplaceOfferQueryOptions(orderId));
}

// ==================== MUTATIONS ====================

export function useAcceptCryptoOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AcceptOfferOutput) => cryptoTransactionApi.acceptOffer(data),
    onSuccess: (transaction) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cryptoMarketplace.offers().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cryptoTransactions.my().queryKey,
      });
      toast.success('Oferta aceita! Transação criada.');
    },
    onError: () => {
      toast.error('Erro ao aceitar oferta');
    },
  });
}
