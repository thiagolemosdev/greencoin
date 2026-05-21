import * as v from 'valibot';

// Schemas de validação para Crypto OTC

// Criar/atualizar carteira
export const createWalletSchema = v.object({
  crypto: v.picklist(['BTC', 'USDT'] as const),
  blockchain: v.picklist(['bitcoin', 'ethereum'] as const),
  address: v.pipe(
    v.string(),
    v.minLength(26, 'Endereço inválido'),
    v.maxLength(42, 'Endereço inválido'),
  ),
});

export type CreateWalletInput = v.InferInput<typeof createWalletSchema>;
export type CreateWalletOutput = v.InferOutput<typeof createWalletSchema>;

// Criar ordem de compra/venda
export const createOrderSchema = v.object({
  type: v.picklist(['buy', 'sell'] as const),
  crypto: v.picklist(['BTC', 'USDT'] as const),
  amount: v.pipe(
    v.string(),
    v.regex(/^\d+(\.\d{1,8})?$/, 'Quantidade inválida'),
    v.minLength(1),
  ),
  pricePerUnit: v.pipe(
    v.string(),
    v.regex(/^\d+(\.\d{1,2})?$/, 'Preço inválido'),
    v.minLength(1),
  ),
  currency: v.picklist(['USD', 'BRL'] as const),
  expiresAtMinutes: v.pipe(
    v.number(),
    v.minValue(5, 'Mínimo 5 minutos'),
    v.maxValue(10080, 'Máximo 7 dias'),
  ),
});

export type CreateOrderInput = v.InferInput<typeof createOrderSchema>;
export type CreateOrderOutput = v.InferOutput<typeof createOrderSchema>;

// Aceitar oferta
export const acceptOfferSchema = v.object({
  orderId: v.string(),
  walletId: v.string(),
});

export type AcceptOfferInput = v.InferInput<typeof acceptOfferSchema>;
export type AcceptOfferOutput = v.InferOutput<typeof acceptOfferSchema>;

// Confirmar transação
export const confirmTransactionSchema = v.object({
  transactionId: v.string(),
  transactionHash: v.optional(v.string()),
});

export type ConfirmTransactionInput = v.InferInput<typeof confirmTransactionSchema>;
export type ConfirmTransactionOutput = v.InferOutput<typeof confirmTransactionSchema>;

// Filtros marketplace
export const marketplaceFiltersSchema = v.object({
  crypto: v.optional(v.picklist(['BTC', 'USDT'] as const)),
  type: v.optional(v.picklist(['buy', 'sell'] as const)),
  minPrice: v.optional(v.pipe(v.string(), v.regex(/^\d+(\.\d{1,2})?$/))),
  maxPrice: v.optional(v.pipe(v.string(), v.regex(/^\d+(\.\d{1,2})?$/))),
  minAmount: v.optional(v.pipe(v.string(), v.regex(/^\d+(\.\d{1,8})?$/))),
  maxAmount: v.optional(v.pipe(v.string(), v.regex(/^\d+(\.\d{1,8})?$/))),
  currency: v.optional(v.picklist(['USD', 'BRL'] as const)),
  sortBy: v.optional(v.picklist(['price_asc', 'price_desc', 'amount_asc', 'amount_desc', 'newest'] as const)),
});

export type MarketplaceFiltersInput = v.InferInput<typeof marketplaceFiltersSchema>;
export type MarketplaceFiltersOutput = v.InferOutput<typeof marketplaceFiltersSchema>;
