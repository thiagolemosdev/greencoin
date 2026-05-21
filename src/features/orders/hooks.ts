import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@core/keys';
import {
  cryptoMyOrdersQueryOptions,
  cryptoOrderByIdQueryOptions,
} from '@core/queries';
import { cryptoOrderApi } from '@core/api/crypto';
import type { CreateOrderOutput } from '@core/schemas/crypto';

// ==================== QUERIES ====================

export function useCryptoMyOrders(filters?: Record<string, string>) {
  return useQuery(cryptoMyOrdersQueryOptions(filters));
}

export function useCryptoOrderById(orderId: string) {
  return useQuery(cryptoOrderByIdQueryOptions(orderId));
}

// ==================== MUTATIONS ====================

export function useCreateCryptoOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderOutput) => cryptoOrderApi.createOrder(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cryptoOrders.my().queryKey,
      });
      toast.success(
        `Oferta para ${data.type === 'buy' ? 'comprar' : 'vender'} ${data.amount} ${data.crypto} criada`,
      );
    },
    onError: () => {
      toast.error('Erro ao criar oferta');
    },
  });
}

export function useCancelCryptoOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cryptoOrderApi.cancelOrder(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cryptoOrders.my().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cryptoOrders.detail(data.id).queryKey,
      });
      toast.success('Oferta cancelada');
    },
    onError: () => {
      toast.error('Erro ao cancelar oferta');
    },
  });
}

export function useUpdateCryptoOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: Partial<CreateOrderOutput>;
    }) => cryptoOrderApi.updateOrder(orderId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cryptoOrders.my().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cryptoOrders.detail(data.id).queryKey,
      });
      toast.success('Oferta atualizada');
    },
    onError: () => {
      toast.error('Erro ao atualizar oferta');
    },
  });
}
