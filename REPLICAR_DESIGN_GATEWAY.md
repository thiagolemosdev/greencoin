# Prompt: Replicar Design System do Gateway na Plataforma OTC

## 🎯 Objetivo
Analisar a estrutura visual e componentes de um gateway existente (com dashboard admin e usuário) e implementar a mesma identidade visual na plataforma OTC Cripto.

## 📋 Etapas

### 1. Análise do Projeto Existente
Leia o código-fonte do gateway e identifique:

**Estrutura Visual:**
- [ ] Paleta de cores (cores primárias, secundárias, neutras, alertas)
- [ ] Tipografia (fontes, tamanhos, pesos)
- [ ] Espaçamento (padding, margin, gap patterns)
- [ ] Componentes base customizados
- [ ] Temas (dark/light mode?)

**Componentes UI:**
- [ ] Navbar/Header (layout, branding, navegação)
- [ ] Sidebar/Menu (estrutura, ícones, animações)
- [ ] Cards (estilos, sombras, borders)
- [ ] Botões (variantes, tamanhos, estados)
- [ ] Formulários (inputs, labels, validação visual)
- [ ] Modais/Diálogos
- [ ] Tabelas (estrutura, paginação)
- [ ] Notificações/Toasts

**Layout:**
- [ ] Estrutura grid/layout
- [ ] Responsive design (breakpoints)
- [ ] Animações e transições
- [ ] Ícones usados (biblioteca)

**Configurações Tailwind:**
- [ ] theme.colors no tailwind.config.ts
- [ ] theme.typography
- [ ] theme.spacing
- [ ] plugins customizados
- [ ] classes customizadas em globals.css

### 2. Documentação de Design
Crie um documento com:
```markdown
# Design System - Gateway

## Cores
- Primary: #XXX
- Secondary: #XXX
- Success: #XXX
- Error: #XXX
- Warning: #XXX
- Info: #XXX
- Neutral: #XXX

## Tipografia
- Display: Fonte + tamanho
- Heading: Fonte + tamanho
- Body: Fonte + tamanho
- Caption: Fonte + tamanho

## Componentes
[Lista de cada componente com variantes]

## Layouts
[Descrição dos layouts principais]
```

### 3. Implementação na Plataforma OTC

**Arquivos a Criar/Modificar:**

1. **Copiar/Adaptar Tailwind Config:**
   - Copiar theme.colors do gateway
   - Copiar theme.typography
   - Copiar plugins customizados
   - Adaptar para projeto OTC

2. **Copiar Componentes UI:**
   - Copiar componentes base (Button, Input, Select, etc)
   - Adaptar imports
   - Testar compatibilidade com existentes

3. **Criar Variantes Crypto:**
   - Componentes específicos para OTC (CryptoCard, OrderForm, etc)
   - Usar as cores/componentes do gateway

4. **Layouts Crypto:**
   - WalletLayout (como admin layout do gateway?)
   - MarketplaceLayout (como user layout?)
   - TransactionLayout

5. **Páginas OTC:**
   - Wallets page
   - Orders page
   - Marketplace page
   - Transactions page

### 4. Verificação
- [ ] Cores consistentes
- [ ] Tipografia correta
- [ ] Componentes com mesmo visual
- [ ] Responsive funciona
- [ ] Dark mode (se existir no gateway)
- [ ] Animações/transições presentes

### 5. Testes
- [ ] Todas as rotas OTC carregam
- [ ] Componentes renderizam corretamente
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Performance OK

## 📁 Estrutura de Arquivos (Esperada)

```
src/
  ui/
    # Componentes copiados do gateway
    button.tsx
    input.tsx
    card.tsx
    [outros do gateway]
    
  pattern/
    # Layouts do gateway adaptados
    admin-layout.tsx (→ WalletAdminLayout?)
    user-layout.tsx (→ UserMarketplaceLayout?)
    
  features/
    wallet/
      components/
        wallet-list.tsx
        wallet-card.tsx
        create-wallet-form.tsx
    orders/
      components/
        order-list.tsx
        order-card.tsx
        order-form.tsx
    marketplace/
      components/
        marketplace-grid.tsx
        offer-card.tsx
        offer-filters.tsx
    transactions/
      components/
        transaction-list.tsx
        transaction-detail.tsx
```

## 🎨 Design Token Structure

Arquivo sugerido: `src/design-tokens.ts`

```typescript
export const designTokens = {
  colors: {
    primary: '#XXX',
    secondary: '#XXX',
    // ... do gateway
  },
  typography: {
    display: '...',
    heading: '...',
    // ... do gateway
  },
  spacing: {
    xs: '...',
    sm: '...',
    // ... do gateway
  },
};
```

## ✅ Checklist Final

- [ ] Gateway analisado completamente
- [ ] Tailwind config copiado/adaptado
- [ ] Componentes UI copiados
- [ ] Layouts criados
- [ ] Todas as rotas OTC implementadas com design do gateway
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Build sem erros

---

## 🚀 Como Executar

### Opção 1: Manual
1. Abrir projeto gateway
2. Notar cores, fontes, componentes
3. Copiar para projeto OTC
4. Adaptar como necessário

### Opção 2: Com Subagent (Recomendado)
```bash
# Executar prompt com agente Explore
/explore Analisar identidade visual do gateway em [CAMINHO] e listar:
- Paleta de cores (RGB/HEX)
- Tipografia (fontes, tamanhos)
- Layouts, componentes e tokens de design
```

> Prompt pronto em `REPLICAR_DESIGN_GATEWAY_PROMPT.md`.

- Componentes base customizados
- Theme colors do tailwind.config.ts
- Estrutura de layouts
```

### Opção 3: Semi-Automático
1. Subagent lê gateway
2. Gera design tokens
3. Você implementa no OTC

---

## 📞 Informações Necessárias

Para começar, preciso saber:
- [ ] Caminho do projeto gateway: `[CAMINHO]`
- [ ] Nome do projeto gateway: `[NOME]`
- [ ] Usa qual UI library? (shadcn/ui, Headless UI, custom?)
- [ ] Tailwind instalado? Qual versão?
- [ ] React Router ou TanStack Router?
- [ ] Tem dark mode?
- [ ] Componentes mais importantes para copiar?

---

## 💡 Dicas

1. **Prioritize:** Copie primeiro componentes base (Button, Input, Card)
2. **Test:** Teste cada componente após copiar
3. **Documentar:** Mantenha design tokens em um arquivo central
4. **Reutilizar:** Máxima reutilização entre admin/user/crypto
5. **Variantes:** Crie variantes crypto (ex: `<Card.Crypto />`)

---

## 📝 Próximas Ações

1. Informar caminho do gateway
2. Eu ler o código com subagent Explore
3. Gerar documento de design
4. Implementar no OTC
5. Validar visual

Quer começar agora? Qual é o caminho do projeto gateway?
