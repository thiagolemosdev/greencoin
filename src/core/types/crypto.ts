// Tipos para criptmoedas e OTC

export type Blockchain = 'bitcoin' | 'ethereum';
export type CryptoSymbol = 'BTC' | 'USDT';

export interface Crypto {
  symbol: CryptoSymbol;
  name: string;
  blockchain: Blockchain;
  decimals: number;
  icon?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  crypto: CryptoSymbol;
  blockchain: Blockchain;
  address: string;
  balance: string; // em wei/satoshi
  balanceFormatted: string; // para exibição
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  type: 'buy' | 'sell'; // Quer comprar ou vender
  crypto: CryptoSymbol;
  amount: string; // em wei/satoshi
  pricePerUnit: string; // preço por unidade
  totalPrice: string; // amount * pricePerUnit
  currency: 'USD' | 'BRL'; // Moeda fiat
  status: 'open' | 'matched' | 'completed' | 'cancelled';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  crypto: CryptoSymbol;
  blockchain: Blockchain;
  amount: string;
  pricePerUnit: string;
  totalPrice: string;
  currency: 'USD' | 'BRL';
  status: 'pending' | 'confirmed' | 'completed' | 'failed' | 'disputed';
  buyerWalletAddress: string;
  sellerWalletAddress: string;
  transactionHash?: string; // Hash na blockchain
  completedAt?: Date;
  failedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketplaceOffer {
  id: string;
  order: Order;
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    completedTrades: number;
  };
}

export interface WalletAddress {
  id: string;
  walletId: string;
  address: string;
  blockchain: Blockchain;
  isVerified: boolean;
  verificationHash?: string;
  createdAt: Date;
}

// Tipos para integração Web3
export interface Web3Provider {
  address?: string;
  isConnected: boolean;
  chainId?: number;
}

export interface Web3Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed?: string;
  status: 'pending' | 'success' | 'failed';
}
