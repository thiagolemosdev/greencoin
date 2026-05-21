import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@core/keys';
import {
  cryptoWalletsQueryOptions,
  cryptoWalletByIdQueryOptions,
  cryptoWalletAddressesQueryOptions,
} from '@core/queries';
import { cryptoWalletApi } from '@core/api/crypto';
import type { CreateWalletOutput } from '@core/schemas/crypto';

// ==================== QUERIES ====================

export function useCryptoWallets() {
  return useQuery(cryptoWalletsQueryOptions);
}

export function useCryptoWalletById(walletId: string) {
  return useQuery(cryptoWalletByIdQueryOptions(walletId));
}

export function useCryptoWalletAddresses(walletId: string) {
  return useQuery(cryptoWalletAddressesQueryOptions(walletId));
}

// ==================== MUTATIONS ====================

export function useCreateCryptoWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWalletOutput) => cryptoWalletApi.createWallet(data),
    onSuccess: (data) => {
      // Invalida a lista de carteiras
      queryClient.invalidateQueries({
        queryKey: queryKeys.cryptoWallets.all.queryKey,
      });
      toast.success(`Carteira ${data.crypto} criada com sucesso`);
    },
    onError: (error) => {
      toast.error('Erro ao criar carteira');
      console.error(error);
    },
  });
}

export function useAddWalletAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      walletId,
      address,
    }: {
      walletId: string;
      address: string;
    }) => cryptoWalletApi.addWalletAddress(walletId, address),
    onSuccess: (data, variables) => {
      // Invalida endereços da carteira
      queryClient.invalidateQueries({
        queryKey: queryKeys.cryptoWallets.addresses(variables.walletId).queryKey,
      });
      toast.success('Endereço adicionado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao adicionar endereço');
    },
  });
}

export function useVerifyWalletAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      walletId,
      addressId,
      signature,
    }: {
      walletId: string;
      addressId: string;
      signature: string;
    }) => cryptoWalletApi.verifyWalletAddress(walletId, addressId, signature),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cryptoWallets.addresses(variables.walletId).queryKey,
      });
      toast.success('Endereço verificado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao verificar endereço');
    },
  });
}
