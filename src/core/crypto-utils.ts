import type { CryptoSymbol } from '@core/types/crypto';
import { CRYPTO_DECIMALS, satoshiToBTC, btcToSatoshi, weiToUSDT, usdtToWei } from '@core/crypto-constants';

/**
 * Formata um valor em wei/satoshi para a unidade legível
 */
export function formatCryptoAmount(amount: string, crypto: CryptoSymbol): string {
  const decimals = CRYPTO_DECIMALS[crypto];
  const num = Number(amount);
  
  if (isNaN(num)) return '0';
  
  const formatted = (num / Math.pow(10, decimals)).toLocaleString('en-US', {
    maximumFractionDigits: 8,
    minimumFractionDigits: 0,
  });
  
  return formatted;
}

/**
 * Converte valor legível para wei/satoshi
 */
export function parseCryptoAmount(amount: string, crypto: CryptoSymbol): string {
  const decimals = CRYPTO_DECIMALS[crypto];
  const num = parseFloat(amount);
  
  if (isNaN(num)) return '0';
  
  return (num * Math.pow(10, decimals)).toFixed(0);
}

/**
 * Formata valor em fiat com símbolo de moeda
 */
export function formatFiatAmount(amount: string | number, currency: 'USD' | 'BRL' = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '0';
  
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formata endereço Ethereum/Bitcoin para exibição
 * Ex: 0x1234...5678
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Valida endereço Ethereum (0x...)
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Valida endereço Bitcoin (começa com 1, 3 ou bc1)
 */
export function isValidBitcoinAddress(address: string): boolean {
  const p2pkh = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/; // P2PKH e P2SH
  const bech32 = /^bc1[a-z0-9]{39,59}$/; // Bech32
  return p2pkh.test(address) || bech32.test(address);
}

/**
 * Calcula o total de uma ordem
 */
export function calculateOrderTotal(amount: string, pricePerUnit: string): string {
  const amountNum = parseFloat(amount);
  const priceNum = parseFloat(pricePerUnit);
  
  if (isNaN(amountNum) || isNaN(priceNum)) return '0';
  
  return (amountNum * priceNum).toFixed(2);
}

/**
 * Calcula taxa sobre um valor
 */
export function calculateFee(amount: string, feePercent: number): string {
  const amountNum = parseFloat(amount);
  
  if (isNaN(amountNum)) return '0';
  
  return ((amountNum * feePercent) / 100).toFixed(2);
}

/**
 * Gera assinatura simulada para teste (usar apenas em DEV)
 * Em produção, usar MetaMask ou web3.js para assinar
 */
export function generateTestSignature(address: string, message: string): string {
  // Simulação: não use em produção!
  const encoder = new TextEncoder();
  const data = encoder.encode(address + message);
  let hash = 0;
  
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data[i];
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Obtém explorador de blocos para uma transação
 */
export function getBlockExplorerUrl(
  txHash: string,
  crypto: CryptoSymbol,
): string {
  if (crypto === 'BTC') {
    return `https://blockchair.com/bitcoin/transaction/${txHash}`;
  } else if (crypto === 'USDT') {
    return `https://etherscan.io/tx/${txHash}`;
  }
  return '';
}

/**
 * Formata status de transação em português
 */
export function formatTransactionStatus(
  status: 'pending' | 'confirmed' | 'completed' | 'failed' | 'disputed',
): string {
  const statusMap: Record<typeof status, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    completed: 'Concluída',
    failed: 'Falhou',
    disputed: 'Disputada',
  };
  
  return statusMap[status] || status;
}

/**
 * Formata status de ordem em português
 */
export function formatOrderStatus(
  status: 'open' | 'matched' | 'completed' | 'cancelled',
): string {
  const statusMap: Record<typeof status, string> = {
    open: 'Aberta',
    matched: 'Pareada',
    completed: 'Concluída',
    cancelled: 'Cancelada',
  };
  
  return statusMap[status] || status;
}
