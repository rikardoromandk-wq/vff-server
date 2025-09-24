import fetch from "node-fetch";

const VINTED_URL = "https://www.vinted.dk/api/v2/catalog/items";
const VINTED_COOKIE = process.env.VINTED_COOKIE || "";

// tip minimal pentru iteme
export interface VintedItem {
  id: number;
  title: string;
  price?: { amount: string; currency_code: string };
  brand_title?: string;
  size_title?: string;
  photo?: { url: string };
}

const MOCK_ITEMS: VintedItem[] = [
  {
    id: 1,
    title: "Ganni Silk Dress (Demo)",
    brand_title: "Ganni",
    price: { amount: "350.00", currency_code: "DKK" },
    size_title: "S",
    photo: {
      url: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
    },
  },
];

export async function fetchVintedItems(
  query: string,
  minMargin: number = 0
): Promise<VintedItem[]> {
  try {
    console.log("🔗 Fetching from Vinted API...", query);

    const url = `${VINTED_URL}?search_text=${encodeURIComponent(query)}&per_page=20&page=1`;

    const response = await fetch(url, {
      headers: {
        Cookie: `_vinted_fr_session=${VINTED_COOKIE}`,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
      },
    });

    if (!response.ok) {
      console.error("❌ Vinted API error:", response.status, await response.text());
      throw new Error(`Vinted API responded with ${response.status}`);
    }

    const data: any = await response.json();

    console.log("✅ Vinted API response received. Items:", data.items?.length || 0);

    if (!data.items || data.items.length === 0) {
      console.warn("⚠️ API returned empty items array, fallback to mock data.");
      return MOCK_ITEMS;
    }

    return data.items;
  } catch (error: any) {
    console.error("❌ Failed to fetch Vinted items:", error.message || error);
    return MOCK_ITEMS;
  }
}
