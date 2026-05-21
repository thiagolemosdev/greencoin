# Architecture Reference

## Stack

| Concern | Library |
|---|---|
| UI | React 19 + TypeScript (strict) |
| Bundler | Vite 6 |
| Package manager | npm |
| Routing | TanStack Router (file-based) |
| Server state | TanStack Query |
| Forms | TanStack Form + Valibot |
| Tables | TanStack Table + TanStack Virtual |
| Client state | Zustand |
| Validation | Valibot |
| Styling | Tailwind CSS v4 |
| Component variants | CVA + tailwind-merge |
| Accessible primitives | Base UI |
| Animations | motion |
| API mocks | MSW |
| Testing | Vitest + Testing Library |
| Lint | ESLint (typescript-eslint + boundaries) + oxlint |
| i18n | Custom loader via `core/i18n.ts` |

---

## Layer responsibilities

```
src/
  core/        Foundation: HTTP client, query keys, query options, stores,
               auth context, i18n, utilities, constants.
               ← No knowledge of features or UI.

  ui/          Design system: purely visual, zero business logic.
               ← Only imports from ui/.

  pattern/     Compound patterns shared across features: data-grid,
               form infrastructure, error boundaries.
               ← Imports from core + ui + pattern.

  layouts/     Visual shells (sidebars, headers, wrappers).
               ← Imports from core + ui + layouts.

  features/    Self-contained feature modules. Each owns its hooks,
               schemas, and components.
               ← Imports from core + ui + pattern + features.

  routes/      Thin route files: guards in beforeLoad, prefetch in loader,
               layout composition, feature wiring.
               ← Imports from all layers except mocks.

  mocks/       MSW handlers. Only for dev and tests.
               ← Imports from core + mocks + features.
```

## Dependency rules (enforced by eslint-plugin-boundaries)

| From → | Can import |
|---|---|
| `core` | `core` |
| `ui` | `ui` |
| `pattern` | `core`, `ui`, `pattern` |
| `layouts` | `core`, `ui`, `layouts` |
| `features` | `core`, `ui`, `pattern`, `features` |
| `routes` | `core`, `ui`, `pattern`, `layouts`, `features` |
| `mocks` | `core`, `mocks`, `features` |

Circular imports are forbidden by the rules above.

---

## Conventions

- **No barrel exports** (`export * from` is banned via ESLint).
- Prefer `type` over `interface`.
- Prefer pure functions over classes (error boundaries are the exception).
- Use path aliases (`@core/*`, `@ui/*`, …) between modules — never relative `../..` paths across layers.
- Avoid type casts (`as X`); fix the type at its source.
- No `useEffect` for data fetching, mutations, or derived state.
- All form validation starts from a Valibot schema — types are inferred, never written manually.

---

## Query architecture

**`core/keys.ts`** — central registry via `@lukemorales/query-key-factory`.

**`core/queries.ts`** — all `queryOptions()` definitions live here. Routes and features consume `useQuery(someQueryOptions)`. They never construct inline query keys.

---

## HTTP client

All requests go through `core/http-resource.ts`:

- Attaches `Authorization`, `Content-Type`, `Accept-Language`.
- Handles `application/problem+json` → typed `FriendlyError`.
- Normalises network failures → `NetworkError`.
- Calls token refresh before protected requests.

No raw `fetch` anywhere else in the codebase.

---

## State strategy

| State type | Tool |
|---|---|
| Server / async | TanStack Query |
| Local component | `useState` / `useReducer` |
| Global client (small) | Zustand store |
| Compound component | React Context |
| URL state | TanStack Router search params |

---

## Forms

Two-layer architecture:

1. **`ui/form.tsx`** — visual primitives: `FormField`, `Label`, `FieldError`, `FieldHint`.
2. **`pattern/form.tsx`** + **`pattern/form.hooks.ts`** — `useAppForm`, `createFormSubmitHandler`, `ManagedTextField`, `FormActions`.

Schema → types → form values flow: always derive types from Valibot schemas via `v.InferOutput<>`.

---

## Testing strategy

| Suite | What | Environment |
|---|---|---|
| `test:unit` | `core/**`, feature hooks, utilities | Node |
| `test:browser` | `ui/**`, `pattern/**` primitives | Playwright/Chromium |
| `test:integration` | Route flows end-to-end | jsdom + MSW |

Test files live in `__specs__/` subdirectories next to the code they test.
