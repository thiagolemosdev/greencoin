import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@core/keys';
import {
  cryptoMyTransactionsQueryOptions,
  cryptoTransactionByIdQueryOptions,
} from '@core/queries';
import { cryptoTransactionApi } from '@core/api/crypto';
import type { ConfirmTransactionOutput } from '@core/schemas/crypto';

// ==================== QUERIES ====================

export function useCryptoMyTransactions(filters?: Record<string, string>) {
  return useQuery(cryptoMyTransactionsQueryOptions(filters));
}

export function useCryptoTransactionById(transactionId: string) {
  return useQuery(cryptoTransactionByIdQueryOptions(transactionId));
}

// ==================== MUTATIONS ====================

export function useConfirmCryptoTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmTransactionOutput) =>
      cryptoTransactionApi.confirmTransaction(data),
    onSuccess: (transaction) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.crypto.transactions.my().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.crypto.transactions.detail(transaction.id).queryKey,
      });
      toast.success('Transação confirmada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao confirmar transação');
    },
  });
}

export function useDisputeCryptoTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      reason,
    }: {
      transactionId: string;
      reason: string;
    }) => cryptoTransactionApi.disputeTransaction(transactionId, reason),
    onSuccess: (transaction) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.crypto.transactions.my().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.crypto.transactions.detail(transaction.id).queryKey,
      });
      toast.success('Transação marcada como disputada');
    },
    onError: () => {
      toast.error('Erro ao marcar transação como disputada');
    },
  });
}
