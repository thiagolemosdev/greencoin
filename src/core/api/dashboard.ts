import { httpResource, defineApiRoute } from "@core/http-resource";

export type RecentOrder = {
  id: string;
  type: "buy" | "sell";
  crypto: "BTC" | "USDT";
  amount: string;
  totalPrice: string;
  currency: string;
  status: "open" | "matched" | "completed" | "cancelled";
  createdAt: string;
};

export type RecentTransaction = {
  id: string;
  crypto: "BTC" | "USDT";
  amount: string;
  totalPrice: string;
  currency: string;
  status: "pending" | "confirmed" | "completed" | "disputed";
  role: "buyer" | "seller";
  createdAt: string;
};

export type DashboardSummary = {
  balanceBtc: string;
  balanceUsdt: string;
  openOrders: number;
  pendingTransactions: number;
  completedTransactions: number;
  volume30d: string;
  btcPrice: number;
  btcChange24h: number;
  usdtPrice: number;
  priceHistory: { day: string; price: number }[];
  recentOrders: RecentOrder[];
  recentTransactions: RecentTransaction[];
};

const summaryRoute = defineApiRoute("GET", "/dashboard/summary");

export function fetchDashboardSummary(signal?: AbortSignal): Promise<DashboardSummary> {
  return httpResource(summaryRoute, { signal });
}
