import fetch from "node-fetch";
import type { Provider, RawListing } from "./types.js";

// mic cache în memorie ca să nu batem excesiv API-ul
const cache = new Map<string, { at: number; items: RawListing[] }>();
const TTL_MS = 1000 * 60; // 60s

function mapItem(x: any): RawListing {
  const price = Number(x.price_numeric ?? x.price ?? 0);
  return {
    id: String(x.id),
    title: x.title || `${x.brand_title ?? ""} ${x.size_title ?? ""}`.trim(),
    brand: x.brand_title ?? "Unknown",
    priceBuy: price,
    shipping: 45,           // poți rafina ulterior
    fees: 20,               // poți rafina ulterior
    expectedSell: Math.round(price * 1.8), // estimare simplă (80% markup)
    lastSoldPrice: price,
    lastSoldDate: x.created_at,
    condition: "Bun",
    size: x.size_title ?? undefined,
    image: x.photo?.url || x.photos?.[0]?.url || "",
    url: `https://www.vinted.dk/items/${x.id}`,
    comps: []
  };
}

export const VintedProvider: Provider = {
  async getRecentListings({ query, brand } = {}) {
    const q = (query || brand || "Nike").trim(); // fallback
    const key = `vinted:${q.toLowerCase()}`;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) return hit.items;

    const url = new URL("https://www.vinted.dk/api/v2/catalog/items");
    url.searchParams.set("search_text", q);
    url.searchParams.set("per_page", "30"); // ia 30 pe pagină
    // Ex: poți adăuga filtre suplimentare (mărime, categorie) aici

    const res = await fetch(url.toString(), {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "accept": "application/json"
      }
    });
    if (!res.ok) throw new Error(`Vinted ${res.status}`);
    const data: any = await res.json();

    const items: RawListing[] = (data?.items ?? []).map(mapItem);
    cache.set(key, { at: Date.now(), items });
    return items;
  }
};
