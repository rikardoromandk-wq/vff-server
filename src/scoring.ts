import { env } from "./config.js";
import type { RawListing } from "./providers/types.js";

export type Scored = RawListing & {
  totalCost: number;
  profit: number;
  margin: number;
  confidence: number;
};

export function scoreListing(i: RawListing): Scored {
  const ship = i.shipping ?? env.DEFAULT_SHIPPING_DKK;
  const feesFixed = i.fees ?? 0;
  const feesPct = (env.PLATFORM_FEE_PERCENT / 100) * i.expectedSell;
  const totalCost = i.priceBuy + ship + feesFixed + feesPct;
  const profit = i.expectedSell - totalCost;
  const margin = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  const recencyBoost = i.lastSoldDate ? Math.max(0, 30 - daysSince(i.lastSoldDate)) / 30 : 0.3;
  const conditionBoost = { "Nou": 0.2, "Foarte bun": 0.15, "Bun": 0.08, "Ok": 0 }[i.condition] ?? 0;
  const compsVar = i.comps && i.comps.length > 1 ? 1 - priceVolatility(i.comps) : 0.5;
  const confidence = clamp(0.1, 0.98, 0.4 * recencyBoost + 0.3 * conditionBoost + 0.3 * compsVar);

  return { ...i, totalCost, profit, margin, confidence };
}

export function sortByKey(arr: Scored[], key: "score"|"profit"|"margin"|"recency") {
  return [...arr].sort((a, b) => {
    if (key === "profit") return b.profit - a.profit;
    if (key === "margin") return b.margin - a.margin;
    if (key === "recency") return (Date.parse(b.lastSoldDate ?? "0") - Date.parse(a.lastSoldDate ?? "0"));
    const scoreA = a.profit * a.confidence;
    const scoreB = b.profit * b.confidence;
    return scoreB - scoreA;
  });
}

function daysSince(dateISO?: string) {
  if (!dateISO) return 9999;
  const d = new Date(dateISO).getTime();
  return Math.floor((Date.now() - d) / (1000 * 60 * 60 * 24));
}

function priceVolatility(comps: { price: number }[]) {
  const avg = comps.reduce((a, c) => a + c.price, 0) / comps.length;
  const variance = comps.reduce((a, c) => a + Math.pow(c.price - avg, 2), 0) / comps.length;
  return Math.sqrt(variance) / (avg || 1);
}

function clamp(min: number, max: number, v: number) {
  return Math.max(min, Math.min(max, v));
}
