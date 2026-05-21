import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useAppForm } from "@pattern/form.hooks";
import { ManagedTextField } from "@pattern/form";
import { useCreateCryptoOrder } from "@features/orders/hooks";
import { createOrderSchema } from "@core/schemas/crypto";

export const Route = createFileRoute("/_main/orders/create")({
  component: CreateOrderPage,
});

// ── Ícones ────────────────────────────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const IconArrowUp = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
const IconArrowDown = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────
const EXPIRY_OPTIONS = [
  { value: 5, label: "5 minutos" },
  { value: 60, label: "1 hora" },
  { value: 240, label: "4 horas" },
  { value: 1440, label: "1 dia" },
  { value: 4320, label: "3 dias" },
  { value: 10080, label: "7 dias" },
];

function formatTotal(amount: string, price: string, currency: string) {
  const a = parseFloat(amount);
  const p = parseFloat(price);
  if (isNaN(a) || isNaN(p) || a <= 0 || p <= 0) return null;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: currency || "USD" }).format(a * p);
}

// ── Styled select ──────────────────────────────────────────────────────────────
function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  required,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
  error?: string | undefined;
  required?: boolean | undefined;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white text-gray-900 transition-colors outline-none focus:ring-2 focus:ring-green-500/30 dark:bg-theme-dark-elevated dark:text-white ${
          error
            ? "border-red-400 dark:border-red-600"
            : "border-gray-300 dark:border-[#333333] hover:border-gray-400 dark:hover:border-[#444]"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
function CreateOrderPage() {
  const navigate = useNavigate();
  const createOrder = useCreateCryptoOrder();

  const form = useAppForm({
    defaultValues: {
      type: "sell" as "buy" | "sell",
      crypto: "BTC" as "BTC" | "USDT",
      amount: "",
      pricePerUnit: "",
      currency: "USD" as "USD" | "BRL",
      expiresAtMinutes: 1440,
    },
    validatorAdapter: valibotValidator(),
    validators: { onSubmit: createOrderSchema },
    onSubmit: async ({ value }) => {
      await createOrder.mutateAsync(value);
      await navigate({ to: "/orders" });
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/orders"
          className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <IconArrowLeft />
          Voltar
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nova Ordem</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Crie uma oferta de compra ou venda de criptomoedas
        </p>
      </div>

      {/* Formulário */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
        className="space-y-5"
      >
        {/* Tipo da ordem — seletor visual */}
        <form.Field name="type">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de ordem <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["buy", "sell"] as const).map((t) => {
                  const isBuy = t === "buy";
                  const isSelected = field.state.value === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => field.handleChange(t)}
                      className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                        isSelected
                          ? isBuy
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-[#333] dark:bg-theme-dark-elevated dark:text-gray-400 dark:hover:border-[#444]"
                      }`}
                    >
                      {isBuy ? <IconArrowDown /> : <IconArrowUp />}
                      {isBuy ? "Comprar" : "Vender"}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </form.Field>

        {/* Linha: Crypto + Moeda */}
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="crypto">
            {(field) => (
              <SelectField
                label="Criptomoeda"
                required
                value={field.state.value}
                onChange={(v) => field.handleChange(v as "BTC" | "USDT")}
                options={[
                  { value: "BTC", label: "Bitcoin (BTC)" },
                  { value: "USDT", label: "Tether (USDT)" },
                ]}
                error={field.state.meta.errors[0] as string | undefined}
              />
            )}
          </form.Field>

          <form.Field name="currency">
            {(field) => (
              <SelectField
                label="Moeda de pagamento"
                required
                value={field.state.value}
                onChange={(v) => field.handleChange(v as "USD" | "BRL")}
                options={[
                  { value: "USD", label: "Dólar (USD)" },
                  { value: "BRL", label: "Real (BRL)" },
                ]}
                error={field.state.meta.errors[0] as string | undefined}
              />
            )}
          </form.Field>
        </div>

        {/* Linha: Quantidade + Preço por unidade */}
        <div className="grid grid-cols-2 gap-4">
          <form.Field name="amount">
            {() => (
              <ManagedTextField
                label="Quantidade"
                name="amount"
                placeholder="0.00"
                hint="Ex: 0.5 para 0.5 BTC"
                required
              />
            )}
          </form.Field>

          <form.Field name="pricePerUnit">
            {() => (
              <ManagedTextField
                label="Preço por unidade"
                name="pricePerUnit"
                placeholder="0.00"
                hint="Preço em USD ou BRL"
                required
              />
            )}
          </form.Field>
        </div>

        {/* Preview do total */}
        <form.Subscribe selector={(s) => ({ amount: s.values.amount, price: s.values.pricePerUnit, currency: s.values.currency })}>
          {({ amount, price, currency }) => {
            const total = formatTotal(amount, price, currency);
            if (!total) return null;
            return (
              <div
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "linear-gradient(to right, rgba(var(--color-primary-rgb), 0.06), rgba(var(--color-accent-rgb), 0.04))",
                  border: "1px solid rgba(var(--color-primary-rgb), 0.2)",
                }}
              >
                <span className="text-gray-600 dark:text-gray-400">Total estimado</span>
                <span className="text-base font-bold" style={{ color: "var(--color-primary)" }}>
                  {total}
                </span>
              </div>
            );
          }}
        </form.Subscribe>

        {/* Validade */}
        <form.Field name="expiresAtMinutes">
          {(field) => (
            <SelectField
              label="Validade da ordem"
              required
              value={field.state.value}
              onChange={(v) => field.handleChange(Number(v))}
              options={EXPIRY_OPTIONS}
              error={field.state.meta.errors[0] as string | undefined}
            />
          )}
        </form.Field>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/orders"
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-[#333] dark:text-gray-400 dark:hover:bg-white/5"
          >
            Cancelar
          </Link>
          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(isSubmitting) => (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
              >
                {isSubmitting ? "Criando..." : "Criar Ordem"}
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
