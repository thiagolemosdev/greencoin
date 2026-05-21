import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createItem, updateItem, deleteItem } from "@core/api/items";
import { queryKeys } from "@core/keys";
import type { CreateItemRequest, UpdateItemRequest } from "@core/api/items";

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateItemRequest) => createItem(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.items._def });
      toast.success("Item criado com sucesso");
    },
    onError: () => toast.error("Erro ao criar item"),
  });
}

export function useUpdateItem(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateItemRequest) => updateItem(id, body),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.items.detail(id).queryKey, updated);
      void queryClient.invalidateQueries({ queryKey: queryKeys.items.list().queryKey });
      toast.success("Item atualizado");
    },
    onError: () => toast.error("Erro ao atualizar item"),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.items._def });
      toast.success("Item removido");
    },
    onError: () => toast.error("Erro ao remover item"),
  });
}
