import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useWeb3Store } from '@core/crypto-store';
import {
  isMetaMaskInstalled,
  requestWeb3Provider,
  onWeb3Changes,
  getConnectedChainId,
  switchChain,
} from '@core/web3-utils';

/**
 * Hook para gerenciar Web3/MetaMask
 * 
 * Uso:
 * ```tsx
 * const { provider, connectWallet, disconnectWallet, isConnected } = useWeb3();
 * ```
 */
export function useWeb3() {
  const provider = useWeb3Store((state) => state.provider);
  const setProvider = useWeb3Store((state) => state.setProvider);
  const connectProvider = useWeb3Store((state) => state.connectProvider);
  const disconnectProvider = useWeb3Store((state) => state.disconnectProvider);
  const updateChainId = useWeb3Store((state) => state.updateChainId);

  // Conectar wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask não está instalado');
      return;
    }

    try {
      const web3Provider = await requestWeb3Provider();
      if (web3Provider) {
        connectProvider(web3Provider.address!, web3Provider.chainId);
        toast.success(`Conectado: ${web3Provider.address}`);
      }
    } catch (error) {
      toast.error('Erro ao conectar wallet');
      console.error(error);
    }
  }, [connectProvider]);

  // Desconectar wallet
  const disconnectWallet = useCallback(() => {
    disconnectProvider();
    toast.success('Desconectado');
  }, [disconnectProvider]);

  // Trocar de rede
  const changeChain = useCallback(
    async (chainId: number) => {
      try {
        await switchChain(chainId);
        updateChainId(chainId);
        toast.success('Rede alterada');
      } catch (error) {
        toast.error('Erro ao trocar de rede');
        console.error(error);
      }
    },
    [updateChainId],
  );

  // Ouve mudanças de conta/rede
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const unsubscribe = onWeb3Changes(
      // Conta mudou
      async (accounts) => {
        if (accounts.length > 0) {
          const chainId = await getConnectedChainId();
          connectProvider(accounts[0], chainId);
        } else {
          disconnectProvider();
        }
      },
      // Rede mudou
      async (chainId) => {
        const chainIdNum = parseInt(chainId, 16);
        updateChainId(chainIdNum);
      },
      // Desconectou
      () => {
        disconnectProvider();
      },
    );

    return unsubscribe;
  }, [connectProvider, disconnectProvider, updateChainId]);

  return {
    provider,
    isConnected: provider?.isConnected ?? false,
    address: provider?.address,
    chainId: provider?.chainId,
    connectWallet,
    disconnectWallet,
    changeChain,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
}

/**
 * Hook para verificar endereço via assinatura
 * Nota: useVerifyWalletAddress deve ser importado do features/wallet/hooks.ts
 */
export function useVerifyAddress() {
  const { address } = useWeb3();

  const verify = useCallback(
    async (walletId: string, addressId: string, verifyFn: (data: any) => void) => {
      if (!address) {
        toast.error('Nenhuma wallet conectada');
        return;
      }

      try {
        // Importar em tempo de uso para evitar erro se ethers não estiver instalado
        const { signMessage } = await import('@core/web3-utils');

        const message = `Verificar propriedade do endereço ${address}`;
        const signature = await signMessage(message);

        verifyFn({ walletId, addressId, signature });
      } catch (error) {
        toast.error('Erro ao assinar mensagem');
        console.error(error);
      }
    },
    [address],
  );

  return { verify };
}
