# Prompt para replicar o design do gateway na plataforma OTC

Use este prompt para analisar o código do gateway existente e implementar a mesma identidade visual no projeto `spa-blueprint`.

## Instruções

1. Localize o outro projeto gateway no seu sistema.
2. Copie o caminho absoluto do projeto gateway.
3. Execute uma análise completa desse projeto.
4. Aplique as mesmas definições de design no `spa-blueprint`.

---

## Prompt

```
Você é um desenvolvedor frontend especialista em React, TypeScript e Tailwind CSS.

Seu objetivo é analisar um projeto gateway existente e replicar sua identidade visual na plataforma OTC Cripto localizada em `spa-blueprint`.

O gateway já possui:
- dashboard administrador
- dashboard usuário
- navegação tipo gateway
- identidade visual consistente entre as duas dashboards

A partir do projeto gateway, identifique e extraia:
- paleta de cores completa (primárias, secundárias, neutras, success, warning, info, error)
- tipografia (fontes, pesos, tamanhos, line-height)
- tokens de espaçamento e borda
- componentes base customizados (botões, inputs, selects, cards, badges, tabelas, modais)
- layouts principais (header, sidebar, conteúdo, footers, grid)
- responsividade e breakpoints
- regras específicas de Tailwind ou CSS utilitário
- animações e transições usadas

### Foco principal
- Copiar/adaptar o design do gateway para o frontend OTC sem mudar a lógica de negócios existente.
- Criar os arquivos de tema e tokens necessários para que o `spa-blueprint` tenha a mesma identidade visual.
- Manter o projeto OTC funcional e com rotas existentes.

### Arquivos de referência para análise do gateway
- `tailwind.config.ts` ou `tailwind.config.js`
- `src/index.css`, `src/styles.css`, `src/global.css`
- diretórios `src/ui`, `src/components`, `src/layouts`
- rotas `src/routes` ou `src/pages`
- arquivos de tema `src/design-tokens.ts`, `src/theme.ts`, `src/styles/*`

### Alterações esperadas no `spa-blueprint`
- `src/design-tokens.ts` com as cores e tipografia do gateway
- `src/ui/*` componentes base adaptados para o novo visual
- `src/layouts/*` layouts de dashboard adaptados
- ajustes no `src/index.css` para suportar o novo tema
- documentação em markdown com o design system aplicado

### Resultado esperado
Entregue:
- design system documentado
- design tokens no `spa-blueprint`
- componente de UI base adaptado
- layouts de wallet, orders, marketplace e transactions com look/feel do gateway
- CSS/Tailwind integrado
```

---

## Como usar

1. Abra o outro projeto gateway.
2. Analise os arquivos listados.
3. Copie o prompt para um agente ou use manualmente.
4. Execute as alterações no `spa-blueprint`.

> Nota: o `spa-blueprint` atual não contém o código do gateway. É necessário fornecer o projeto gateway para implementação exata.
