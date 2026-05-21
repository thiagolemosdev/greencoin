import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Web3Provider } from '@core/types/crypto';

interface Web3Store {
  // Dados da wallet conectada
  provider: Web3Provider | null;
  
  // Métodos
  setProvider: (provider: Web3Provider | null) => void;
  connectProvider: (address: string, chainId?: number) => void;
  disconnectProvider: () => void;
  updateChainId: (chainId: number) => void;
}

export const useWeb3Store = create<Web3Store>()(
  persist(
    (set) => ({
      provider: null,
      
      setProvider: (provider) => set({ provider }),
      
      connectProvider: (address, chainId) =>
        set({
          provider: {
            address,
            isConnected: true,
            chainId,
          },
        }),
      
      disconnectProvider: () =>
        set({
          provider: null,
        }),
      
      updateChainId: (chainId) =>
        set((state) => ({
          provider: state.provider
            ? { ...state.provider, chainId }
            : null,
        })),
    }),
    {
      name: 'web3-store',
    },
  ),
);

// ==================== MARKETPLACE FILTERS STORE ====================

interface MarketplaceFiltersState {
  selectedCrypto?: 'BTC' | 'USDT';
  selectedType?: 'buy' | 'sell';
  minPrice?: string;
  maxPrice?: string;
  minAmount?: string;
  maxAmount?: string;
  currency?: 'USD' | 'BRL';
  sortBy?: 'price_asc' | 'price_desc' | 'amount_asc' | 'amount_desc' | 'newest';
}

interface MarketplaceFiltersStore extends MarketplaceFiltersState {
  setFilters: (filters: Partial<MarketplaceFiltersState>) => void;
  resetFilters: () => void;
  getFilters: () => Partial<MarketplaceFiltersState>;
}

export const useMarketplaceFiltersStore = create<MarketplaceFiltersStore>()(
  persist(
    (set, get) => ({
      selectedCrypto: undefined,
      selectedType: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      currency: 'USD',
      sortBy: 'newest',
      
      setFilters: (filters) => set((state) => ({ ...state, ...filters })),
      
      resetFilters: () =>
        set({
          selectedCrypto: undefined,
          selectedType: undefined,
          minPrice: undefined,
          maxPrice: undefined,
          minAmount: undefined,
          maxAmount: undefined,
          currency: 'USD',
          sortBy: 'newest',
        }),
      
      getFilters: () => {
        const state = get();
        return {
          crypto: state.selectedCrypto,
          type: state.selectedType,
          minPrice: state.minPrice,
          maxPrice: state.maxPrice,
          minAmount: state.minAmount,
          maxAmount: state.maxAmount,
          currency: state.currency,
          sortBy: state.sortBy,
        };
      },
    }),
    {
      name: 'marketplace-filters-store',
    },
  ),
);
