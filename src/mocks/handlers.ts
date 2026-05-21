import { http, HttpResponse, delay } from "msw";
import { API_BASE_URL } from "@core/constants";

const LATENCY = 300;

// ==================== WALLETS DB ====================
type WalletRow = {
  id: string;
  userId: string;
  crypto: "BTC" | "USDT";
  blockchain: "bitcoin" | "ethereum";
  address: string;
  balance: string;
  balanceFormatted: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type WalletAddressRow = {
  id: string;
  walletId: string;
  address: string;
  blockchain: "bitcoin" | "ethereum";
  isVerified: boolean;
  verificationHash?: string;
  createdAt: string;
};

const WALLETS_DB: WalletRow[] = [
  {
    id: "wallet-1",
    userId: "user-1",
    crypto: "BTC",
    blockchain: "bitcoin",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    balance: "150000000",
    balanceFormatted: "1.5 BTC",
    isVerified: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-01T12:00:00Z",
  },
  {
    id: "wallet-2",
    userId: "user-1",
    crypto: "USDT",
    blockchain: "ethereum",
    address: "0x742d35Cc6634C0532925a3b8D4C9B5a5e3d6f4A",
    balance: "250000000",
    balanceFormatted: "2500.00 USDT",
    isVerified: false,
    createdAt: "2024-02-20T08:30:00Z",
    updatedAt: "2024-02-20T08:30:00Z",
  },
];

const WALLET_ADDRESSES_DB: WalletAddressRow[] = [
  {
    id: "addr-1",
    walletId: "wallet-1",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    blockchain: "bitcoin",
    isVerified: true,
    verificationHash: "0xabc123",
    createdAt: "2024-01-15T10:00:00Z",
  },
];

// ==================== ORDERS DB ====================
type OrderRow = {
  id: string;
  userId: string;
  type: "buy" | "sell";
  crypto: "BTC" | "USDT";
  amount: string;
  pricePerUnit: string;
  totalPrice: string;
  currency: "USD" | "BRL";
  status: "open" | "matched" | "completed" | "cancelled";
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

const ORDERS_DB: OrderRow[] = [
  {
    id: "order-1",
    userId: "user-1",
    type: "sell",
    crypto: "BTC",
    amount: "0.5",
    pricePerUnit: "95000.00",
    totalPrice: "47500.00",
    currency: "USD",
    status: "open",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "order-2",
    userId: "user-1",
    type: "buy",
    crypto: "USDT",
    amount: "1000",
    pricePerUnit: "1.00",
    totalPrice: "1000.00",
    currency: "USD",
    status: "matched",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    createdAt: "2024-03-05T14:30:00Z",
    updatedAt: "2024-03-06T09:00:00Z",
  },
  {
    id: "order-3",
    userId: "user-1",
    type: "sell",
    crypto: "USDT",
    amount: "500",
    pricePerUnit: "1.02",
    totalPrice: "510.00",
    currency: "USD",
    status: "completed",
    expiresAt: "2024-02-28T00:00:00Z",
    createdAt: "2024-02-25T08:00:00Z",
    updatedAt: "2024-02-27T16:00:00Z",
  },
  {
    id: "order-4",
    userId: "user-1",
    type: "buy",
    crypto: "BTC",
    amount: "0.1",
    pricePerUnit: "92000.00",
    totalPrice: "9200.00",
    currency: "USD",
    status: "cancelled",
    expiresAt: "2024-02-20T00:00:00Z",
    createdAt: "2024-02-18T11:00:00Z",
    updatedAt: "2024-02-19T10:00:00Z",
  },
];

// ==================== MARKETPLACE DB ====================
type MarketplaceOfferRow = {
  id: string;
  order: {
    id: string;
    userId: string;
    type: "buy" | "sell";
    crypto: "BTC" | "USDT";
    amount: string;
    pricePerUnit: string;
    totalPrice: string;
    currency: "USD" | "BRL";
    status: "open" | "matched" | "completed" | "cancelled";
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
  };
  seller: {
    id: string;
    name: string;
    rating: number;
    completedTrades: number;
  };
};

type TransactionRow = {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  crypto: "BTC" | "USDT";
  blockchain: "bitcoin" | "ethereum";
  amount: string;
  pricePerUnit: string;
  totalPrice: string;
  currency: "USD" | "BRL";
  status: "pending" | "confirmed" | "completed" | "failed" | "disputed";
  buyerWalletAddress: string;
  sellerWalletAddress: string;
  transactionHash?: string;
  completedAt?: string;
  failedReason?: string;
  createdAt: string;
  updatedAt: string;
};

const MARKETPLACE_DB: MarketplaceOfferRow[] = [
  {
    id: "offer-1",
    order: {
      id: "mkt-order-1",
      userId: "user-2",
      type: "sell",
      crypto: "BTC",
      amount: "0.25",
      pricePerUnit: "94500.00",
      totalPrice: "23625.00",
      currency: "USD",
      status: "open",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
      createdAt: "2024-04-01T10:00:00Z",
      updatedAt: "2024-04-01T10:00:00Z",
    },
    seller: { id: "user-2", name: "Carlos M.", rating: 4.9, completedTrades: 87 },
  },
  {
    id: "offer-2",
    order: {
      id: "mkt-order-2",
      userId: "user-3",
      type: "sell",
      crypto: "USDT",
      amount: "5000",
      pricePerUnit: "1.01",
      totalPrice: "5050.00",
      currency: "USD",
      status: "open",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
      createdAt: "2024-04-02T08:00:00Z",
      updatedAt: "2024-04-02T08:00:00Z",
    },
    seller: { id: "user-3", name: "Ana P.", rating: 4.7, completedTrades: 43 },
  },
  {
    id: "offer-3",
    order: {
      id: "mkt-order-3",
      userId: "user-4",
      type: "buy",
      crypto: "BTC",
      amount: "0.1",
      pricePerUnit: "93000.00",
      totalPrice: "9300.00",
      currency: "USD",
      status: "open",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
      createdAt: "2024-04-03T14:30:00Z",
      updatedAt: "2024-04-03T14:30:00Z",
    },
    seller: { id: "user-4", name: "Rafael S.", rating: 5.0, completedTrades: 212 },
  },
  {
    id: "offer-4",
    order: {
      id: "mkt-order-4",
      userId: "user-5",
      type: "sell",
      crypto: "BTC",
      amount: "1.0",
      pricePerUnit: "96000.00",
      totalPrice: "96000.00",
      currency: "BRL",
      status: "open",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
      createdAt: "2024-04-04T09:00:00Z",
      updatedAt: "2024-04-04T09:00:00Z",
    },
    seller: { id: "user-5", name: "Julia F.", rating: 4.8, completedTrades: 65 },
  },
  {
    id: "offer-5",
    order: {
      id: "mkt-order-5",
      userId: "user-6",
      type: "buy",
      crypto: "USDT",
      amount: "2000",
      pricePerUnit: "0.99",
      totalPrice: "1980.00",
      currency: "USD",
      status: "open",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
      createdAt: "2024-04-05T11:00:00Z",
      updatedAt: "2024-04-05T11:00:00Z",
    },
    seller: { id: "user-6", name: "Pedro L.", rating: 4.6, completedTrades: 31 },
  },
];

const TRANSACTIONS_DB: TransactionRow[] = [];

// ==================== ITEMS DB ====================
const ITEMS_DB = [
  { id: "1", title: "First item", description: "A sample item", status: "active", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-10T00:00:00Z" },
  { id: "2", title: "Second item", description: "Another sample", status: "inactive", createdAt: "2024-01-02T00:00:00Z", updatedAt: "2024-01-11T00:00:00Z" },
  { id: "3", title: "Third item", description: "", status: "archived", createdAt: "2024-01-03T00:00:00Z", updatedAt: "2024-01-12T00:00:00Z" },
];

const MOCK_USER = { id: "user-1", email: "dev@example.com", name: "Dev User" };

export const handlers = [
  // Auth
  http.get(`${API_BASE_URL}/auth/me`, async () => {
    await delay(LATENCY);
    return HttpResponse.json(MOCK_USER);
  }),

  http.post(`${API_BASE_URL}/auth/sign-in`, async ({ request }) => {
    await delay(LATENCY);
    const body = await request.json() as { email: string; password: string };
    if (body.password === "wrong") {
      return HttpResponse.json(
        { type: "friendly_error", title: "Invalid credentials", detail: "Check your email and password.", status: 401 },
        { status: 401, headers: { "content-type": "application/problem+json" } },
      );
    }
    return HttpResponse.json({ accessToken: "mock-access", refreshToken: "mock-refresh", user: MOCK_USER });
  }),

  http.post(`${API_BASE_URL}/auth/sign-out`, async () => {
    await delay(LATENCY);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    await delay(LATENCY);
    const body = await request.json() as { name: string; email: string };
    return HttpResponse.json({ ...MOCK_USER, name: body.name, email: body.email });
  }),

  // Items
  http.get(`${API_BASE_URL}/items`, async ({ request }) => {
    await delay(LATENCY);
    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? "";
    const page = Number(url.searchParams.get("page") ?? "1");
    const filtered = ITEMS_DB.filter((i) =>
      i.title.toLowerCase().includes(search.toLowerCase()),
    );
    return HttpResponse.json({
      data: filtered.slice((page - 1) * 20, page * 20),
      total: filtered.length,
      page,
      pageSize: 20,
    });
  }),

  http.post(`${API_BASE_URL}/items`, async ({ request }) => {
    await delay(LATENCY);
    const body = await request.json() as { title: string; description: string };
    const newItem = { id: String(Date.now()), ...body, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    ITEMS_DB.push(newItem);
    return HttpResponse.json(newItem, { status: 201 });
  }),

  http.get(`${API_BASE_URL}/items/:id`, async ({ params }) => {
    await delay(LATENCY);
    const item = ITEMS_DB.find((i) => i.id === params["id"]);
    if (!item) return HttpResponse.json({ type: "friendly_error", title: "Not found", detail: "Item not found.", status: 404 }, { status: 404, headers: { "content-type": "application/problem+json" } });
    return HttpResponse.json(item);
  }),

  http.delete(`${API_BASE_URL}/items/:id`, async ({ params }) => {
    await delay(LATENCY);
    const idx = ITEMS_DB.findIndex((i) => i.id === params["id"]);
    if (idx !== -1) ITEMS_DB.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Dashboard
  http.get(`${API_BASE_URL}/dashboard/summary`, async () => {
    await delay(LATENCY);
    return HttpResponse.json({
      totalItems: ITEMS_DB.length,
      activeItems: ITEMS_DB.filter((i) => i.status === "active").length,
      recentActivity: [],
    });
  }),

  // Profile
  http.get(`${API_BASE_URL}/profiles/:userId`, async ({ params }) => {
    await delay(LATENCY);
    return HttpResponse.json({
      id: "profile-1",
      userId: params["userId"],
      name: MOCK_USER.name,
      email: MOCK_USER.email,
      bio: "A sample bio.",
      updatedAt: new Date().toISOString(),
    });
  }),

  http.patch(`${API_BASE_URL}/profiles/:userId`, async ({ request, params }) => {
    await delay(LATENCY);
    const body = await request.json() as Record<string, string>;
    return HttpResponse.json({
      id: "profile-1",
      userId: params["userId"],
      ...body,
      email: MOCK_USER.email,
      updatedAt: new Date().toISOString(),
    });
  }),

  // Settings
  http.get(`${API_BASE_URL}/settings`, async () => {
    await delay(LATENCY);
    return HttpResponse.json({
      notifications: { email: true, push: false },
      theme: "system",
      language: "en",
    });
  }),

  // Feature A
  http.get(`${API_BASE_URL}/feature-a/records`, async () => {
    await delay(LATENCY);
    return HttpResponse.json([
      { id: "1", label: "Record Alpha", value: 42, active: true },
      { id: "2", label: "Record Beta", value: 17, active: false },
      { id: "3", label: "Record Gamma", value: 93, active: true },
    ]);
  }),

  // Feature B
  http.post(`${API_BASE_URL}/feature-b/submit`, async () => {
    await delay(LATENCY);
    return new HttpResponse(null, { status: 204 });
  }),

  // ==================== CRYPTO WALLETS ====================

  http.get(`${API_BASE_URL}/crypto/wallets`, async () => {
    await delay(LATENCY);
    return HttpResponse.json(WALLETS_DB.filter((w) => w.userId === "user-1"));
  }),

  http.post(`${API_BASE_URL}/crypto/wallets`, async ({ request }) => {
    await delay(LATENCY);
    const body = await request.json() as { crypto: "BTC" | "USDT"; blockchain: "bitcoin" | "ethereum"; address: string };
    const newWallet: WalletRow = {
      id: `wallet-${Date.now()}`,
      userId: "user-1",
      crypto: body.crypto,
      blockchain: body.blockchain,
      address: body.address,
      balance: "0",
      balanceFormatted: `0 ${body.crypto}`,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    WALLETS_DB.push(newWallet);
    return HttpResponse.json(newWallet, { status: 201 });
  }),

  http.get(`${API_BASE_URL}/crypto/wallets/:walletId`, async ({ params }) => {
    await delay(LATENCY);
    const wallet = WALLETS_DB.find((w) => w.id === params["walletId"]);
    if (!wallet) {
      return HttpResponse.json(
        { type: "friendly_error", title: "Not found", detail: "Carteira não encontrada.", status: 404 },
        { status: 404, headers: { "content-type": "application/problem+json" } },
      );
    }
    return HttpResponse.json(wallet);
  }),

  http.get(`${API_BASE_URL}/crypto/wallets/:walletId/addresses`, async ({ params }) => {
    await delay(LATENCY);
    const addresses = WALLET_ADDRESSES_DB.filter((a) => a.walletId === params["walletId"]);
    return HttpResponse.json(addresses);
  }),

  http.post(`${API_BASE_URL}/crypto/wallets/:walletId/addresses`, async ({ request, params }) => {
    await delay(LATENCY);
    const wallet = WALLETS_DB.find((w) => w.id === params["walletId"]);
    if (!wallet) {
      return HttpResponse.json(
        { type: "friendly_error", title: "Not found", detail: "Carteira não encontrada.", status: 404 },
        { status: 404, headers: { "content-type": "application/problem+json" } },
      );
    }
    const body = await request.json() as { address: string };
    const newAddress: WalletAddressRow = {
      id: `addr-${Date.now()}`,
      walletId: params["walletId"] as string,
      address: body.address,
      blockchain: wallet.blockchain,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
    WALLET_ADDRESSES_DB.push(newAddress);
    return HttpResponse.json(newAddress, { status: 201 });
  }),

  // ==================== CRYPTO ORDERS ====================

  http.get(`${API_BASE_URL}/crypto/orders`, async ({ request }) => {
    await delay(LATENCY);
    const url = new URL(request.url);
    let orders = ORDERS_DB.filter((o) => o.userId === "user-1");
    const status = url.searchParams.get("status");
    const type = url.searchParams.get("type");
    const crypto = url.searchParams.get("crypto");
    if (status) orders = orders.filter((o) => o.status === status);
    if (type) orders = orders.filter((o) => o.type === type);
    if (crypto) orders = orders.filter((o) => o.crypto === crypto);
    return HttpResponse.json(orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }),

  http.post(`${API_BASE_URL}/crypto/orders`, async ({ request }) => {
    await delay(LATENCY);
    const body = await request.json() as {
      type: "buy" | "sell";
      crypto: "BTC" | "USDT";
      amount: string;
      pricePerUnit: string;
      currency: "USD" | "BRL";
      expiresAtMinutes: number;
    };
    const total = (parseFloat(body.amount) * parseFloat(body.pricePerUnit)).toFixed(2);
    const newOrder: OrderRow = {
      id: `order-${Date.now()}`,
      userId: "user-1",
      type: body.type,
      crypto: body.crypto,
      amount: body.amount,
      pricePerUnit: body.pricePerUnit,
      totalPrice: total,
      currency: body.currency,
      status: "open",
      expiresAt: new Date(Date.now() + body.expiresAtMinutes * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    ORDERS_DB.push(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  http.get(`${API_BASE_URL}/crypto/orders/:orderId`, async ({ params }) => {
    await delay(LATENCY);
    const order = ORDERS_DB.find((o) => o.id === params["orderId"]);
    if (!order) {
      return HttpResponse.json(
        { type: "friendly_error", title: "Not found", detail: "Ordem não encontrada.", status: 404 },
        { status: 404, headers: { "content-type": "application/problem+json" } },
      );
    }
    return HttpResponse.json(order);
  }),

  http.put(`${API_BASE_URL}/crypto/orders/:orderId/cancel`, async ({ params }) => {
    await delay(LATENCY);
    const order = ORDERS_DB.find((o) => o.id === params["orderId"]);
    if (!order) {
      return HttpResponse.json(
        { type: "friendly_error", title: "Not found", detail: "Ordem não encontrada.", status: 404 },
        { status: 404, headers: { "content-type": "application/problem+json" } },
      );
    }
    if (order.status !== "open") {
      return HttpResponse.json(
        { type: "friendly_error", title: "Conflict", detail: "Apenas ordens abertas podem ser canceladas.", status: 409 },
        { status: 409, headers: { "content-type": "application/problem+json" } },
      );
    }
    order.status = "cancelled";
    order.updatedAt = new Date().toISOString();
    return HttpResponse.json(order);
  }),

  http.put(`${API_BASE_URL}/crypto/orders/:orderId`, async ({ request, params }) => {
    await delay(LATENCY);
    const order = ORDERS_DB.find((o) => o.id === params["orderId"]);
    if (!order) {
      return HttpResponse.json(
        { type: "friendly_error", title: "Not found", detail: "Ordem não encontrada.", status: 404 },
        { status: 404, headers: { "content-type": "application/problem+json" } },
      );
    }
    const body = await request.json() as Partial<OrderRow>;
    Object.assign(order, body, { updatedAt: new Date().toISOString() });
    return HttpResponse.json(order);
  }),

  http.post(`${API_BASE_URL}/crypto/wallets/:walletId/addresses/:addressId/verify`, async ({ params }) => {
    await delay(LATENCY);
    const addr = WALLET_ADDRESSES_DB.find(
      (a) => a.walletId === params["walletId"] && a.id === params["addressId"],
    );
    if (!addr) {
      return HttpResponse.json(
        { type: "friendly_error", title: "Not found", detail: "Endereço não encontrado.", status: 404 },
        { status: 404, headers: { "content-type": "application/problem+json" } },
      );
    }
    addr.isVerified = true;
    addr.verificationHash = `0x${Math.random().toString(16).slice(2)}`;
    return HttpResponse.json(addr);
  }),

  // ==================== MARKETPLACE ====================

  http.get(`${API_BASE_URL}/crypto/marketplace`, async ({ request }) => {
    await delay(LATENCY);
    const url = new URL(request.url);
    let offers = MARKETPLACE_DB.filter((o) => o.order.status === "open");
    const crypto = url.searchParams.get("crypto");
    const type = url.searchParams.get("type");
    const currency = url.searchParams.get("currency");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const sortBy = url.searchParams.get("sortBy") ?? "newest";
    if (crypto) offers = offers.filter((o) => o.order.crypto === crypto);
    if (type) offers = offers.filter((o) => o.order.type === type);
    if (currency) offers = offers.filter((o) => o.order.currency === currency);
    if (minPrice) offers = offers.filter((o) => parseFloat(o.order.pricePerUnit) >= parseFloat(minPrice));
    if (maxPrice) offers = offers.filter((o) => parseFloat(o.order.pricePerUnit) <= parseFloat(maxPrice));
    if (sortBy === "price_asc") offers.sort((a, b) => parseFloat(a.order.pricePerUnit) - parseFloat(b.order.pricePerUnit));
    else if (sortBy === "price_desc") offers.sort((a, b) => parseFloat(b.order.pricePerUnit) - parseFloat(a.order.pricePerUnit));
    else offers.sort((a, b) => b.order.createdAt.localeCompare(a.order.createdAt));
    return HttpResponse.json(offers);
  }),

  http.get(`${API_BASE_URL}/crypto/marketplace/:orderId`, async ({ params }) => {
    await delay(LATENCY);
    const offer = MARKETPLACE_DB.find((o) => o.id === params["orderId"]);
    if (!offer) {
      return HttpResponse.json(
        { type: "friendly_error", title: "Not found", detail: "Oferta não encontrada.", status: 404 },
        { status: 404, headers: { "content-type": "application/problem+json" } },
      );
    }
    return HttpResponse.json(offer);
  }),

  // ==================== TRANSACTIONS ====================

  http.get(`${API_BASE_URL}/crypto/transactions`, async () => {
    await delay(LATENCY);
    return HttpResponse.json(
      TRANSACTIONS_DB.filter((t) => t.buyerId === "user-1" || t.sellerId === "user-1")
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  }),

  http.post(`${API_BASE_URL}/crypto/transactions`, async ({ request }) => {
    await delay(LATENCY);
    const body = await request.json() as { orderId: string; walletId: string };
    const offer = MARKETPLACE_DB.find((o) => o.order.id === body.orderId);
    if (!offer) {
      return HttpResponse.json(
        { type: "friendly_error", title: "Not found", detail: "Oferta não encontrada.", status: 404 },
        { status: 404, headers: { "content-type": "application/problem+json" } },
      );
    }
    const wallet = WALLETS_DB.find((w) => w.id === body.walletId);
    const newTx: TransactionRow = {
      id: `tx-${Date.now()}`,
      orderId: body.orderId,
      buyerId: offer.order.type === "sell" ? "user-1" : offer.order.userId,
      sellerId: offer.order.type === "sell" ? offer.order.userId : "user-1",
      crypto: offer.order.crypto,
      blockchain: offer.order.crypto === "BTC" ? "bitcoin" : "ethereum",
      amount: offer.order.amount,
      pricePerUnit: offer.order.pricePerUnit,
      totalPrice: offer.order.totalPrice,
      currency: offer.order.currency,
      status: "pending",
      buyerWalletAddress: wallet?.address ?? "",
      sellerWalletAddress: offer.seller.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    TRANSACTIONS_DB.push(newTx);
    offer.order.status = "matched";
    return HttpResponse.json(newTx, { status: 201 });
  }),

  http.get(`${API_BASE_URL}/crypto/transactions/:transactionId`, async ({ params }) => {
    await delay(LATENCY);
    const tx = TRANSACTIONS_DB.find((t) => t.id === params["transactionId"]);
    if (!tx) {
      return HttpResponse.json(
        { type: "friendly_error", title: "Not found", detail: "Transação não encontrada.", status: 404 },
        { status: 404, headers: { "content-type": "application/problem+json" } },
      );
    }
    return HttpResponse.json(tx);
  }),
];
