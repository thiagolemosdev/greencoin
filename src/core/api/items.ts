import { httpResource, defineApiRoute, defineApiRouteFn } from "@core/http-resource";

export type Item = {
  id: string;
  title: string;
  description: string;
  status: "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type ItemsPage = {
  data: Item[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateItemRequest = {
  title: string;
  description: string;
};

export type UpdateItemRequest = Partial<CreateItemRequest> & {
  status?: Item["status"];
};

const listRoute = defineApiRoute("GET", "/items");
const createRoute = defineApiRoute("POST", "/items");
const detailRoute = defineApiRouteFn<{ id: string }>("GET", ({ id }) => `/items/${id}`);
const updateRoute = defineApiRouteFn<{ id: string }>("PATCH", ({ id }) => `/items/${id}`);
const deleteRoute = defineApiRouteFn<{ id: string }>("DELETE", ({ id }) => `/items/${id}`);

export function fetchItems(options?: {
  search?: string;
  page?: number;
  signal?: AbortSignal;
}): Promise<ItemsPage> {
  return httpResource(listRoute, {
    searchParams: { search: options?.search, page: options?.page },
    signal: options?.signal,
  });
}

export function fetchItemById(id: string, signal?: AbortSignal): Promise<Item> {
  return httpResource(detailRoute, { params: { id }, signal });
}

export function createItem(body: CreateItemRequest): Promise<Item> {
  return httpResource(createRoute, { body });
}

export function updateItem(id: string, body: UpdateItemRequest): Promise<Item> {
  return httpResource(updateRoute, { params: { id }, body });
}

export function deleteItem(id: string): Promise<void> {
  return httpResource(deleteRoute, { params: { id } });
}
