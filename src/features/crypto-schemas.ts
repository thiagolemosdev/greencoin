import * as v from 'valibot';
import { isValidBitcoinAddress, isValidEthereumAddress } from '@core/crypto-utils';

// Validação de endereço
const ethereumAddressSchema = v.pipe(
  v.string(),
  v.custom((input) => isValidEthereumAddress(input as string), 'Endereço Ethereum inválido'),
);

const bitcoinAddressSchema = v.pipe(
  v.string(),
  v.custom((input) => isValidBitcoinAddress(input as string), 'Endereço Bitcoin inválido'),
);

// ==================== WALLET FEATURES ====================

export const walletFormSchema = v.object({
  crypto: v.picklist(['BTC', 'USDT'] as const, 'Criptomoeda inválida'),
  blockchain: v.picklist(['bitcoin', 'ethereum'] as const, 'Blockchain inválido'),
});

export type WalletFormInput = v.InferInput<typeof walletFormSchema>;
export type WalletFormOutput = v.InferOutput<typeof walletFormSchema>;

export const addWalletAddressSchema = v.object({
  address: v.union([ethereumAddressSchema, bitcoinAddressSchema]),
});

export type AddWalletAddressInput = v.InferInput<typeof addWalletAddressSchema>;
export type AddWalletAddressOutput = v.InferOutput<typeof addWalletAddressSchema>;

// ==================== ORDER FEATURES ====================

export const orderFormSchema = v.object({
  type: v.picklist(['buy', 'sell'] as const, 'Tipo de ordem inválido'),
  crypto: v.picklist(['BTC', 'USDT'] as const, 'Criptomoeda inválida'),
  amount: v.pipe(
    v.string(),
    v.minLength(1, 'Quantidade obrigatória'),
    v.regex(/^\d+(\.\d{1,8})?$/, 'Quantidade inválida'),
    v.custom(
      (input) => parseFloat(input as string) > 0,
      'Quantidade deve ser maior que 0',
    ),
  ),
  pricePerUnit: v.pipe(
    v.string(),
    v.minLength(1, 'Preço obrigatório'),
    v.regex(/^\d+(\.\d{1,2})?$/, 'Preço inválido'),
    v.custom(
      (input) => parseFloat(input as string) > 0,
      'Preço deve ser maior que 0',
    ),
  ),
  currency: v.picklist(['USD', 'BRL'] as const, 'Moeda inválida'),
  expiresAtMinutes: v.pipe(
    v.number('Tempo de expiração obrigatório'),
    v.minValue(5, 'Mínimo 5 minutos'),
    v.maxValue(10080, 'Máximo 7 dias'),
  ),
});

export type OrderFormInput = v.InferInput<typeof orderFormSchema>;
export type OrderFormOutput = v.InferOutput<typeof orderFormSchema>;

// ==================== MARKETPLACE FEATURES ====================

export const marketplaceSearchSchema = v.object({
  crypto: v.optional(v.picklist(['BTC', 'USDT'] as const)),
  type: v.optional(v.picklist(['buy', 'sell'] as const)),
  minPrice: v.optional(
    v.pipe(
      v.string(),
      v.regex(/^\d+(\.\d{1,2})?$/),
      v.custom(
        (input) => parseFloat(input as string) >= 0,
        'Valor mínimo inválido',
      ),
    ),
  ),
  maxPrice: v.optional(
    v.pipe(
      v.string(),
      v.regex(/^\d+(\.\d{1,2})?$/),
      v.custom(
        (input) => parseFloat(input as string) >= 0,
        'Valor máximo inválido',
      ),
    ),
  ),
  currency: v.optional(v.picklist(['USD', 'BRL'] as const)),
  sortBy: v.optional(
    v.picklist([
      'price_asc',
      'price_desc',
      'amount_asc',
      'amount_desc',
      'newest',
    ] as const),
  ),
});

export type MarketplaceSearchInput = v.InferInput<typeof marketplaceSearchSchema>;
export type MarketplaceSearchOutput = v.InferOutput<typeof marketplaceSearchSchema>;

// ==================== TRANSACTION FEATURES ====================

export const confirmTransactionFormSchema = v.object({
  walletAddress: v.union([ethereumAddressSchema, bitcoinAddressSchema]),
  transactionHash: v.optional(
    v.pipe(
      v.string(),
      v.minLength(1),
      v.regex(/^0x[a-fA-F0-9]{64}$|^[a-fA-F0-9]{64}$/, 'Hash de transação inválido'),
    ),
  ),
});

export type ConfirmTransactionFormInput = v.InferInput<typeof confirmTransactionFormSchema>;
export type ConfirmTransactionFormOutput = v.InferOutput<typeof confirmTransactionFormSchema>;

export const disputeTransactionFormSchema = v.object({
  reason: v.pipe(
    v.string(),
    v.minLength(10, 'Motivo deve ter no mínimo 10 caracteres'),
    v.maxLength(500, 'Motivo não pode ter mais de 500 caracteres'),
  ),
});

export type DisputeTransactionFormInput = v.InferInput<typeof disputeTransactionFormSchema>;
export type DisputeTransactionFormOutput = v.InferOutput<typeof disputeTransactionFormSchema>;
