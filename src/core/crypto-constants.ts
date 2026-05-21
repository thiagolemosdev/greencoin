import type { Crypto } from '@core/types/crypto';

// Criptmoedas suportadas
export const SUPPORTED_CRYPTOS: Record<string, Crypto> = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    blockchain: 'bitcoin',
    decimals: 8,
    icon: '₿',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether (USD)',
    blockchain: 'ethereum',
    decimals: 6,
    icon: '₮',
  },
};

// Blockchains suportadas
export const SUPPORTED_BLOCKCHAINS = {
  bitcoin: {
    name: 'Bitcoin Network',
    chainId: null, // Bitcoin não usa chainId
    rpc: 'https://bitcoin-mainnet-rpc.example.com',
    explorer: 'https://blockchair.com/bitcoin',
  },
  ethereum: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpc: 'https://eth-mainnet.g.alchemy.com/v2/demo',
    explorer: 'https://etherscan.io',
  },
} as const;

// Conversões de unidade
export const CRYPTO_DECIMALS = {
  BTC: 8, // 1 BTC = 100,000,000 satoshis
  USDT: 6, // 1 USDT = 1,000,000 wei
} as const;

export function satoshiToBTC(satoshi: string): number {
  return Number(satoshi) / 100_000_000;
}

export function btcToSatoshi(btc: number): string {
  return (btc * 100_000_000).toFixed(0);
}

export function weiToUSDT(wei: string): number {
  return Number(wei) / 1_000_000;
}

export function usdtToWei(usdt: number): string {
  return (usdt * 1_000_000).toFixed(0);
}

// Modo teste
export const IS_TEST_MODE = import.meta.env.VITE_CRYPTO_TEST_MODE === 'true';

// Confirmações necessárias por blockchain
export const REQUIRED_CONFIRMATIONS = {
  bitcoin: 3,
  ethereum: 12,
} as const;

// Taxas estimadas (em %)
export const ESTIMATED_FEES = {
  bitcoin: 0.001, // 0.1%
  ethereum: 0.002, // 0.2%
} as const;
