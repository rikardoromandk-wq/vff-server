import fetch from "node-fetch";
import { MOCK_ITEMS } from "./mock.js";

export async function fetchVintedItems(query: string) {
  const url = `https://www.vinted.dk/api/v2/catalog/items?search_text=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ProfitApp/1.0; +https://profit-app.dev)"
      }
    });

    if (res.status === 403) {
      console.warn("⚠️ Vinted a returnat 403, folosim mock data");
      return MOCK_ITEMS; // fallback pentru dezvoltare
    }

    if (!res.ok) throw new Error(`Vinted ${res.status}`);

    const data = await res.json();
    return data.items;
  } catch (e) {
    console.error("Eroare fetch:", e);
    return MOCK_ITEMS;
  }
}
