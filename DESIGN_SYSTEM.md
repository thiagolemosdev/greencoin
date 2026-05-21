# Design System — spa-blueprint

> Identidade visual replicada do **FlashPay** (gateway de pagamentos).
> Gateway analisado: `/home/thiago.oliveira/Documentos/FlashPay/frontend`

---

## Cores

| Token           | Valor     | Uso                          |
|-----------------|-----------|------------------------------|
| Primary         | `#16a34a` | Ações principais, links ativos |
| Primary Hover   | `#15803d` | Hover do primary              |
| Secondary       | `#15803d` | Gradientes, variação          |
| Accent          | `#22c55e` | Destaques leves               |
| Success         | `#22c55e` | Estados de sucesso            |
| Error           | `#ef4444` | Erros e alertas               |
| Warning         | `#f59e0b` | Avisos                        |
| Info            | `#3b82f6` | Informações                   |

### Superfícies (Light)

| Token             | Valor     |
|-------------------|-----------|
| Background        | `#F9FAFB` |
| Card Background   | `#FFFFFF` |
| Sidebar Background| `#FFFFFF` |
| Surface Strong    | `#f3f4f6` |
| Border            | `#E5E7EB` |

### Superfícies (Dark) — valores exatos do FlashPay

| Token           | Valor     |
|-----------------|-----------|
| Dark BG         | `#0a0a0a` |
| Dark Surface    | `#111111` |
| Dark Card       | `#151515` |
| Dark Elevated   | `#1a1a1a` |
| Dark Border     | `#222222` |

---

## Tipografia

- **Fonte principal:** Inter (UI sans-serif)
- **Fonte mono:** JetBrains Mono

| Escala | Tamanho  |
|--------|----------|
| xs     | 0.75rem  |
| sm     | 0.875rem |
| base   | 1rem     |
| lg     | 1.125rem |
| xl     | 1.25rem  |
| 2xl    | 1.5rem   |
| 3xl    | 1.875rem |
| 4xl    | 2.25rem  |

| Peso     | Valor |
|----------|-------|
| normal   | 400   |
| medium   | 500   |
| semibold | 600   |
| bold     | 700   |

---

## Layout

### Sidebar
- Largura: `w-64` (256px)
- Background: `#ffffff` light / `#151515` dark
- Borda: `border-r border-[#e5e7eb]` / `dark:border-[#222222]`
- Item ativo: gradiente `linear-gradient(to right, #16a34a, #15803d)` + `text-white`
- Item hover: `hover:border-green-500 hover:bg-gray-100`
- Efeito: `sidebar-glow` (linha animada na borda direita)

### Header
- Altura: `h-16` (64px)
- Background: `#ffffff` light / `#1a1a1a` dark
- Borda: `border-b border-[#e5e7eb]` / `dark:border-[#2a2a2a]`
- Conteúdo: nome do app + toggle dark mode + usuário + logout

### Main Content
- Background: `bg-gray-50` light / `dark:bg-gray-950`
- Padding: `p-4 md:p-6`

---

## Componentes

### Card (`src/ui/card.tsx`)

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";

<Card hover>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Conteúdo</CardContent>
</Card>
```

Props:
- `hover?: boolean` — ativa hover com shadow e border verde

### StatCard (`src/ui/stat-card.tsx`)

```tsx
import { StatCard } from "@ui/stat-card";

<StatCard
  title="Total de Transações"
  value="R$ 12.450"
  subtitle="Últimos 30 dias"
  icon={<IconArrows />}
  iconColor="green"
  trend={{ value: "+12%", isPositive: true }}
  gradient
/>
```

Props:
- `gradient?: boolean` — card com bg verde degradê (destaque principal)
- `iconColor`: `"green" | "blue" | "orange" | "red" | "yellow" | "purple"`
- `trend`: `{ value: string; isPositive: boolean }`
- `action`: `{ label: string; onClick: () => void }`

### Badge (`src/ui/badge.tsx`)

```tsx
import { Badge } from "@ui/badge";

<Badge variant="success">Ativo</Badge>
<Badge variant="destructive">Cancelado</Badge>
<Badge variant="warning">Pendente</Badge>
<Badge variant="info">Informação</Badge>
```

Variantes: `default | primary | success | warning | destructive | info | purple | outline`
Dark mode incluído em todas as variantes.

### Button (`src/ui/button.tsx`)

```tsx
import { Button } from "@ui/button";

<Button variant="primary">Salvar</Button>
<Button variant="outline" size="sm">Cancelar</Button>
<Button loading>Processando...</Button>
```

Variantes: `primary | secondary | destructive | ghost | outline | link`
Tamanhos: `xs | sm | md | lg | xl | icon`

---

## Classes Utilitárias

| Classe             | Efeito                                          |
|--------------------|-------------------------------------------------|
| `.gradient-card`   | Card com shimmer verde no hover                 |
| `.glass-effect`    | Card com backdrop-filter blur                   |
| `.gradient-theme`  | Gradiente diagonal verde (primary → secondary)  |
| `.neon-glow`       | Sombra neon verde                               |
| `.shadow-theme-primary` | Shadow verde 14px                          |
| `.table-row-hover` | Linha de tabela com slide verde no hover        |
| `.interactive-hover` | Card sobe 4px no hover com shadow verde      |
| `.metric-counter`  | Card com barra de progresso animada no topo     |
| `.loading-shimmer` | Shimmer verde animado (skeleton)                |
| `.sidebar-glow`    | Borda direita da sidebar com pulso verde        |
| `.bg-primary-10`   | Background 10% opacidade do primary             |
| `.bg-success-10`   | Background 10% opacidade do success             |
| `.bg-error-10`     | Background 10% opacidade do error               |
| `.btn-theme-primary` | Botão gradiente verde                         |
| `.btn-theme-outline` | Botão outline verde                           |

---

## Dark Mode

Controlado via classe `.dark` no `<html>`. Gerenciado pelo `useAppStore`:

```tsx
import { useAppStore } from "@core/app-store";

const { darkMode, toggleDarkMode } = useAppStore();
```

O estado persiste no `localStorage`. Na inicialização, a classe `.dark` é aplicada automaticamente via `onRehydrateStorage`.

---

## Variáveis CSS

Disponíveis em `:root` (e sobrescritas em `.dark`):

```css
--color-primary: #16a34a;
--color-secondary: #15803d;
--color-accent: #22c55e;
--color-primary-rgb: 22, 163, 74;   /* para rgba() */
--color-error: #ef4444;
--color-warning: #f59e0b;
--color-info: #3b82f6;
--color-success: #22c55e;
```

Uso em CSS inline (padrão FlashPay):
```tsx
style={{
  background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
  color: `rgba(var(--color-primary-rgb), 0.15)`,
}}
```

---

## Animações

| Keyframe        | Uso                                      |
|-----------------|------------------------------------------|
| `sidebar-pulse` | Linha de brilho na borda da sidebar      |
| `progress-bar`  | Barra deslizante no metric-counter       |
| `shimmer`       | Efeito de carregamento skeleton          |
| `pulse-glow`    | Pulsação de brilho (dot status)          |
| `slide-in-up`   | Entrada de elementos de baixo para cima  |
| `stagger-in`    | Entrada em escala (cards, listas)        |
| `floating`      | Flutuação suave (elementos decorativos)  |

---

## Estrutura de Arquivos

```
src/
  design-tokens.ts          # Tokens centralizados (TS)
  index.css                 # Tailwind v4 + @theme + utilities + animations
  ui/
    card.tsx                # Card base (FlashPay style)
    stat-card.tsx           # Card de métricas (FlashPay)
    badge.tsx               # Badge com dark mode
    button.tsx              # Button com loading state
    button.variants.ts      # CVA variants
    header.tsx              # PageHeader / SectionHeader
    ...                     # Outros componentes shadcn-like
  layouts/
    main-layout.tsx         # Layout principal com sidebar FlashPay
  core/
    app-store.ts            # darkMode state + toggleDarkMode
```

---

## Referência Original

- **Projeto gateway:** FlashPay (`/Documentos/FlashPay/frontend`)
- **Biblioteca de ícones:** Lucide React (no gateway) → SVG inline (no spa-blueprint)
- **Componentes UI do gateway analisados:**
  - `src/components/ui/Button.tsx`
  - `src/components/ui/Card.tsx`
  - `src/components/ui/Badge.tsx`
  - `src/components/ui/StatCard.tsx`
  - `src/components/layout/AdminLayout.tsx`
  - `src/components/layout/AdminSidebar.tsx`
  - `src/components/layout/SellerLayout.tsx`
  - `src/components/layout/SellerSidebar.tsx`
  - `src/components/layout/Header.tsx`
  - `tailwind.config.js`
  - `src/index.css`
