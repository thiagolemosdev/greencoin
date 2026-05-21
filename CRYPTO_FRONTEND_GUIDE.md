# Frontend OTC Crypto - Guia de Implementação

## 📁 Estrutura de Arquivos

```
src/
  core/
    ├── api/crypto.ts           # API endpoints (funções para chamar backend)
    ├── crypto-constants.ts     # Constantes (blockchains, decimals, etc)
    ├── crypto-store.ts         # Zustand stores (Web3, filtros)
    ├── crypto-utils.ts         # Funções utilitárias (formatação, validação)
    ├── keys.ts                 # Query keys (adicionadas)
    ├── queries.ts              # Query options (adicionadas)
    ├── schemas/crypto.ts       # Schemas Valibot para API
    └── types/crypto.ts         # TypeScript types
  
  features/
    ├── wallet/
    │   ├── hooks.ts            # useCreateCryptoWallet(), useAddWalletAddress(), etc
    │   ├── schemas.ts          # ❌ NÃO EXISTE (use crypto-schemas.ts)
    │   └── [componentes aqui]
    │
    ├── orders/
    │   ├── hooks.ts            # useCreateCryptoOrder(), useCancelCryptoOrder(), etc
    │   └── [componentes aqui]
    │
    ├── marketplace/
    │   ├── hooks.ts            # useCryptoMarketplaceOffers(), useAcceptCryptoOffer()
    │   └── [componentes aqui]
    │
    ├── transactions/
    │   ├── hooks.ts            # useCryptoMyTransactions(), useConfirmCryptoTransaction(), etc
    │   └── [componentes aqui]
    │
    └── crypto-schemas.ts       # ✅ Schemas Valibot para formulários de features
```

---

## 🔧 Como Criar um Componente

### 1. Hook para Dados

```tsx
// features/wallet/hooks.ts
import { useCryptoWallets } from '@core/hooks';  // ❌ Não existe
import { useCryptoWallets } from '@features/wallet/hooks';  // ✅ Certo

function useMyData() {
  const { data: wallets } = useCryptoWallets();
  return wallets;
}
```

### 2. Hook para Formulário

```tsx
// features/wallet/hooks.ts
import { useForm } from '@tanstack/react-form';
import { valibotValidator } from '@tanstack/valibot-form-adapter';
import { walletFormSchema } from '@features/crypto-schemas';

export function useWalletForm() {
  return useForm({
    defaultValues: { crypto: 'BTC', blockchain: 'bitcoin' },
    validatorAdapter: valibotValidator(),
    onSubmit: async (formData) => {
      // Usar mutation aqui
    },
  });
}
```

### 3. Componente com Forma

```tsx
// features/wallet/create-wallet.tsx
import { useWalletForm } from './hooks';
import { Form } from '@pattern/form';
import { Button } from '@ui/button';

export function CreateWalletForm() {
  const form = useWalletForm();
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      {/* Form fields */}
      <Button type="submit">Criar Carteira</Button>
    </form>
  );
}
```

---

## 🎯 Exemplos de Uso

### Exemplo 1: Listar Carteiras

```tsx
import { useCryptoWallets } from '@features/wallet/hooks';

export function WalletList() {
  const { data: wallets, isLoading } = useCryptoWallets();
  
  return (
    <ul>
      {wallets?.map((wallet) => (
        <li key={wallet.id}>
          {wallet.crypto} - {wallet.balanceFormatted}
        </li>
      ))}
    </ul>
  );
}
```

### Exemplo 2: Criar Oferta

```tsx
import { useCreateCryptoOrder } from '@features/orders/hooks';
import { useForm } from '@tanstack/react-form';
import { valibotValidator } from '@tanstack/valibot-form-adapter';
import { orderFormSchema } from '@features/crypto-schemas';

export function CreateOrderForm() {
  const createOrder = useCreateCryptoOrder();
  
  const form = useForm({
    defaultValues: {
      type: 'buy',
      crypto: 'BTC',
      amount: '',
      pricePerUnit: '',
      currency: 'USD',
      expiresAtMinutes: 60,
    },
    validatorAdapter: valibotValidator(),
    onSubmit: async (formData) => {
      createOrder.mutate(formData);
    },
  });
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      {/* Form fields */}
    </form>
  );
}
```

### Exemplo 3: Filtrar Marketplace

```tsx
import { useCryptoMarketplaceOffers } from '@features/marketplace/hooks';
import { useMarketplaceFiltersStore } from '@core/crypto-store';

export function Marketplace() {
  const filters = useMarketplaceFiltersStore((state) => state.getFilters());
  const { data: offers } = useCryptoMarketplaceOffers(filters);
  
  return <OfferList offers={offers} />;
}
```

### Exemplo 4: Aceitar Oferta

```tsx
import { useAcceptCryptoOffer } from '@features/marketplace/hooks';
import { useCryptoWallets } from '@features/wallet/hooks';

export function OfferDetail({ orderId }: { orderId: string }) {
  const acceptOffer = useAcceptCryptoOffer();
  const { data: wallets } = useCryptoWallets();
  const [selectedWalletId, setSelectedWalletId] = useState('');
  
  const handleAccept = () => {
    acceptOffer.mutate({
      orderId,
      walletId: selectedWalletId,
    });
  };
  
  return (
    <div>
      <select onChange={(e) => setSelectedWalletId(e.target.value)}>
        {wallets?.map((w) => (
          <option key={w.id} value={w.id}>{w.crypto}</option>
        ))}
      </select>
      <Button onClick={handleAccept}>Aceitar Oferta</Button>
    </div>
  );
}
```

### Exemplo 5: Confirmar Transação

```tsx
import { useConfirmCryptoTransaction } from '@features/transactions/hooks';

export function TransactionDetail({ transactionId }: { transactionId: string }) {
  const confirmTx = useConfirmCryptoTransaction();
  const [txHash, setTxHash] = useState('');
  
  const handleConfirm = () => {
    confirmTx.mutate({
      transactionId,
      transactionHash: txHash,
    });
  };
  
  return (
    <div>
      <input
        placeholder="Hash da transação (opcional)"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
      />
      <Button onClick={handleConfirm}>Confirmar Envio</Button>
    </div>
  );
}
```

---

## 🌐 Integração Web3 (MetaMask)

### Próximos Passos

1. **Instalar Web3 libraries:**
```bash
npm install ethers web3modal wagmi viem
```

2. **Criar Web3 Context:**
```tsx
// src/core/web3-context.tsx
import { createContext } from 'react';
import type { Web3Provider } from '@core/types/crypto';

export const Web3Context = createContext<Web3Provider | null>(null);
```

3. **Criar Hook para Conectar Wallet:**
```tsx
// src/core/hooks/useWeb3.ts
export function useWeb3() {
  const web3Store = useWeb3Store();
  
  async function connectMetaMask() {
    const accounts = await window.ethereum?.request({
      method: 'eth_requestAccounts',
    });
    
    const chainId = await window.ethereum?.request({
      method: 'eth_chainId',
    });
    
    web3Store.connectProvider(accounts[0], parseInt(chainId));
  }
  
  return { connectMetaMask };
}
```

4. **Assinar Mensagem para Verificação:**
```tsx
// src/core/web3-utils.ts
import { ethers } from 'ethers';

export async function signAddressVerification(address: string): Promise<string> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const message = `Verificar propriedade do endereço ${address}`;
  const signature = await signer.signMessage(message);
  
  return signature;
}
```

---

## 📦 Constantes e Utilidades Disponíveis

### Formatação

```tsx
import { 
  formatCryptoAmount,     // "100000000" → "1.00 BTC"
  formatFiatAmount,       // "45000" → "US$ 45,000.00"
  formatAddress,          // "0x123..." → "0x12...3"
  getBlockExplorerUrl,    // URL para ver transação
} from '@core/crypto-utils';
```

### Validação

```tsx
import { 
  isValidEthereumAddress,
  isValidBitcoinAddress,
  isValidEthereumAddress,
} from '@core/crypto-utils';
```

### Conversão de Unidades

```tsx
import { 
  satoshiToBTC,
  btcToSatoshi,
  weiToUSDT,
  usdtToWei,
  parseCryptoAmount,
} from '@core/crypto-constants';
```

### Status

```tsx
import { 
  formatTransactionStatus,  // "pending" → "Pendente"
  formatOrderStatus,        // "open" → "Aberta"
} from '@core/crypto-utils';
```

---

## ✅ Checklist de Implementação

- [ ] Página de Carteiras
  - [ ] Listar carteiras
  - [ ] Criar carteira
  - [ ] Adicionar endereço
  - [ ] Verificar endereço (com MetaMask)
  
- [ ] Página de Ofertas
  - [ ] Criar oferta (buy/sell)
  - [ ] Listar minhas ofertas
  - [ ] Editar oferta
  - [ ] Cancelar oferta
  
- [ ] Página Marketplace
  - [ ] Listar ofertas disponíveis
  - [ ] Filtrar (crypto, tipo, preço)
  - [ ] Ver detalhes da oferta
  - [ ] Aceitar oferta
  
- [ ] Página de Transações
  - [ ] Listar minhas transações
  - [ ] Ver detalhe da transação
  - [ ] Confirmar envio de cripto
  - [ ] Disputar transação
  
- [ ] Web3 Integration
  - [ ] Conectar MetaMask
  - [ ] Assinar mensagens
  - [ ] Detectar mudança de rede
  - [ ] Suporte para múltiplas wallets

---

## 🚀 Próximas Features

1. **Sistema de Rating** - Avaliação de usuários
2. **Notificações** - Push/Email para transações
3. **Arbitragem** - Sistema de disputa
4. **Depósitos Fiat** - Integração Stripe
5. **Histórico de Preços** - Gráficos
6. **Carteira Simulada** - Para testes

