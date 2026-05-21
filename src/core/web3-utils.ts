/**
 * Utilitários Web3 para integração com MetaMask e outras wallets
 * IMPORTANTE: Usar apenas em modo desenvolvimento/teste
 * Em produção, usar ethers.js ou web3.js
 */

import type { Web3Provider } from '@core/types/crypto';
import { IS_TEST_MODE } from '@core/crypto-constants';

declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Verifica se MetaMask está instalado
 */
export function isMetaMaskInstalled(): boolean {
  return typeof window.ethereum !== 'undefined';
}

/**
 * Obtém provider do MetaMask/Wallet
 */
export async function requestWeb3Provider(): Promise<Web3Provider | null> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask não instalado. Instale em https://metamask.io');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    return {
      address: accounts[0],
      isConnected: true,
      chainId: parseInt(chainId, 16),
    };
  } catch (error) {
    console.error('Erro ao conectar MetaMask:', error);
    throw error;
  }
}

/**
 * Assina uma mensagem (para verificação de endereço)
 */
export async function signMessage(message: string): Promise<string> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask não disponível');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('Nenhuma conta conectada');
    }

    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, accounts[0]],
    });

    return signature;
  } catch (error) {
    console.error('Erro ao assinar mensagem:', error);
    throw error;
  }
}

/**
 * Assina uma transação (para teste)
 * Em produção, usar JSON-RPC sendTransaction
 */
export async function signTransaction(
  to: string,
  value: string,
  data?: string,
): Promise<string> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask não disponível');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: accounts[0],
          to,
          value,
          data,
        },
      ],
    });

    return txHash;
  } catch (error) {
    console.error('Erro ao assinar transação:', error);
    throw error;
  }
}

/**
 * Ouve eventos de mudança de conta/rede
 */
export function onWeb3Changes(
  onAccountsChanged?: (accounts: string[]) => void,
  onChainChanged?: (chainId: string) => void,
  onDisconnect?: () => void,
): () => void {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  if (onAccountsChanged) {
    window.ethereum.on('accountsChanged', onAccountsChanged);
  }

  if (onChainChanged) {
    window.ethereum.on('chainChanged', onChainChanged);
  }

  if (onDisconnect) {
    window.ethereum.on('disconnect', onDisconnect);
  }

  // Retorna função para remover listeners
  return () => {
    if (onAccountsChanged) {
      window.ethereum.removeListener('accountsChanged', onAccountsChanged);
    }
    if (onChainChanged) {
      window.ethereum.removeListener('chainChanged', onChainChanged);
    }
    if (onDisconnect) {
      window.ethereum.removeListener('disconnect', onDisconnect);
    }
  };
}

/**
 * Verifica a rede conectada
 */
export async function getConnectedChainId(): Promise<number> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask não disponível');
  }

  const chainId = await window.ethereum.request({
    method: 'eth_chainId',
  });

  return parseInt(chainId, 16);
}

/**
 * Solicita mudança de rede (EIP-3326)
 */
export async function switchChain(chainId: number): Promise<void> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask não disponível');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      throw new Error('Rede não adicionada. Adicione manualmente no MetaMask.');
    }
    throw error;
  }
}

/**
 * Adiciona token customizado ao MetaMask (EIP-747)
 */
export async function addTokenToMetaMask(
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage?: string,
): Promise<boolean> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask não disponível');
  }

  try {
    return await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });
  } catch (error) {
    console.error('Erro ao adicionar token:', error);
    return false;
  }
}

/**
 * Gera assinatura simulada para teste
 * ⚠️ APENAS PARA MODO TESTE - NÃO USE EM PRODUÇÃO
 */
export function generateTestSignature(address: string, message: string): string {
  if (!IS_TEST_MODE) {
    throw new Error('Assinatura de teste apenas disponível em VITE_CRYPTO_TEST_MODE=true');
  }

  // Simulação: gera um hash pseudo-aleatório
  const encoder = new TextEncoder();
  const data = encoder.encode(address + message + Date.now());
  let hash = 0;

  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data[i];
    hash = hash & hash;
  }

  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Valida se uma assinatura é válida
 * ⚠️ Implementação simplificada - usar ethers.verifyMessage em produção
 */
export function isValidSignature(
  address: string,
  message: string,
  signature: string,
): boolean {
  if (IS_TEST_MODE) {
    // Em modo teste, aceita qualquer assinatura
    return signature.startsWith('0x') && signature.length === 66;
  }

  // Em produção, usar ethers.js
  // const recoveredAddress = ethers.verifyMessage(message, signature);
  // return recoveredAddress.toLowerCase() === address.toLowerCase();

  return false;
}
