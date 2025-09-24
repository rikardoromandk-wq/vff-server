import fetch from "node-fetch";

type ItemOut = {
  id: string | number;
  title: string;
  brand: string;
  priceBuy: number;
  shipping: number;
  fees: number;
  expectedSell: number;
  lastSoldPrice: number;
  lastSoldDate: string;
  condition: string;
  size: string;
  image?: string;
  url: string;
  comps: Array<{ price: number; date: string }>;
  totalCost: number;
  profit: number;
  margin: number;
  confidence: number;
};

function compute(item: {
  id: any;
  title?: string;
  brand?: { title?: string };
  price_numeric?: number;
  status?: string;
  size_title?: string;
  photo?: { url?: string };
}): ItemOut {
  const priceBuy = Number(item?.price_numeric ?? 0);
  const shipping = 45;
  const fees = 20;
  const expectedSell = Math.round(priceBuy * 1.8);
  const totalCost = priceBuy + shipping + fees;
  const profit = expectedSell - totalCost;
  const margin = totalCost ? (profit / totalCost) * 100 : 0;

  return {
    id: item?.id ?? Math.random().toString(36).slice(2),
    title: item?.title || "Fără titlu",
    brand: item?.brand?.title || "Necunoscut",
    priceBuy,
    shipping,
    fees,
    expectedSell,
    lastSoldPrice: priceBuy,
    lastSoldDate: new Date().toISOString().slice(0, 10),
    condition: item?.status || "Bun",
    size: item?.size_title || "",
    image: item?.photo?.url,
    url: item?.id ? `https://www.vinted.dk/items/${item.id}` : "https://www.vinted.dk/",
    comps: [],
    totalCost,
    profit,
    margin: Number(margin.toFixed(2)),
    confidence: 0.6,
  };
}

function apiUrl(q: string, page = 1, perPage = 20) {
  const u = new URL("https://www.vinted.dk/api/v2/catalog/items");
  u.searchParams.set("search_text", q);
  u.searchParams.set("order", "newest_first");
  u.searchParams.set("page", String(page));
  u.searchParams.set("per_page", String(perPage));
  u.searchParams.set("_ts", String(Date.now()));
  return u.toString();
}

async function callVinted(q: string, useCookie: boolean) {
  const url = apiUrl(q);
  const cookie = process.env.VINTED_COOKIE || "";
  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    Accept: "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.vinted.dk/",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };
  if (useCookie && cookie) headers["Cookie"] = cookie;

  const res = await fetch(url, { headers });
  if (res.status === 304) throw new Error("304 cache");
  if (!res.ok) throw new Error(`Vinted ${res.status}`);
  const data: any = await res.json();
  return Array.isArray(data?.items) ? data.items : [];
}

const MOCK: ItemOut[] = [
  {
    id: "demo-1",
    title: "Ganni Silk Dress",
    brand: "Ganni",
    priceBuy: 350,
    shipping: 45,
    fees: 20,
    expectedSell: 650,
    lastSoldPrice: 640,
    lastSoldDate: "2025-09-05",
    condition: "Foarte bun",
    size: "S",
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
    url: "https://www.vinted.dk/",
    comps: [
      { price: 640, date: "2025-09-05" },
      { price: 660, date: "2025-08-18" },
    ],
    totalCost: 480,
    profit: 170,
    margin: 35.41,
    confidence: 0.5,
  },
];

export async function getVintedItems(q: string, minMargin: number): Promise<ItemOut[]> {
  try {
    // 1) încearcă cu cookie (dacă există)
    const itemsWithCookie: any[] = await callVinted(q, true);
    const outWithCookie = itemsWithCookie
      .map((i: any) => compute(i))
      .filter((i: ItemOut) => i.margin >= minMargin)
      .sort((a: ItemOut, b: ItemOut) => b.profit - a.profit);

    if (outWithCookie.length > 0) return outWithCookie;
  } catch {
    // ignoră și încearcă fără cookie
  }

  try {
    // 2) fără cookie
    const itemsNoCookie: any[] = await callVinted(q, false);
    const outNoCookie = itemsNoCookie
      .map((i: any) => compute(i))
      .filter((i: ItemOut) => i.margin >= minMargin)
      .sort((a: ItemOut, b: ItemOut) => b.profit - a.profit);

    if (outNoCookie.length > 0) return outNoCookie;
  } catch {
    // ignoră, mergem la fallback
  }

  // 3) fallback cu mock
  return MOCK.filter((i: ItemOut) => i.margin >= minMargin);
}
