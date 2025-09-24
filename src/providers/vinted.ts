// src/providers/vinted.ts
import fetch from "node-fetch";

export interface VintedItem {
  id: number;
  title: string;
  brand_title: string;
  price: { amount: string; currency_code: string };
  size_title: string;
  photo: { url: string };
}

export async function fetchVintedItems(query: string = ""): Promise<VintedItem[]> {
  try {
    const cookie = process.env.VINTED_COOKIE;
    if (!cookie) {
      console.warn("⚠️ VINTED_COOKIE is missing in environment variables.");
      return [];
    }

    const url = `https://www.vinted.dk/api/v2/catalog/items?search_text=${encodeURIComponent(
      query
    )}&per_page=20&page=1`;

    console.log(`🔗 Fetching from: ${url}`);

    const response = await fetch(url, {
      headers: {
        cookie: `_vinted_fr_session=${cookie}`,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        referer: "https://www.vinted.dk/",
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "x-requested-with": "XMLHttpRequest",
      },
    });

    if (response.status === 403) {
      console.error("❌ Vinted API returned 403 (blocked by Cloudflare)");
      return [];
    }

    if (!response.ok) {
      console.error(`❌ Vinted API error: ${response.status}`);
      return [];
    }

    const json: unknown = await response.json();

    // Type guard to be safe
    if (
      typeof json === "object" &&
      json !== null &&
      "items" in json &&
      Array.isArray((json as any).items)
    ) {
      const items = (json as any).items as VintedItem[];
      console.log(`✅ Got ${items.length} items from Vinted`);
      return items;
    }

    console.warn("⚠️ Unexpected response format from Vinted", json);
    return [];
  } catch (err) {
    console.error("❌ Error fetching Vinted items:", err);
    return [];
  }
}
