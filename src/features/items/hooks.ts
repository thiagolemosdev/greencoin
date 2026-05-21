import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem, updateItem, deleteItem } from "@core/api/items";
import { queryKeys } from "@core/keys";
import type { CreateItemRequest, UpdateItemRequest } from "@core/api/items";

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateItemRequest) => createItem(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.items._def });
    },
  });
}

export function useUpdateItem(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateItemRequest) => updateItem(id, body),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.items.detail(id).queryKey, updated);
      void queryClient.invalidateQueries({ queryKey: queryKeys.items.list().queryKey });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.items._def });
    },
  });
}
