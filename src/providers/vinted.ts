// src/providers/vinted.ts
import fetch from "node-fetch";
import { MOCK_ITEMS } from "./mock.js";

export async function fetchVintedItems(query: string, minMargin: number) {
  try {
    const url = `https://www.vinted.dk/api/v2/catalog/items?search_text=${encodeURIComponent(
      query
    )}`;

    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });

    if (!res.ok) {
      console.warn("⚠️ Vinted API a dat eroare, folosim MOCK_ITEMS");
      return MOCK_ITEMS.filter((i) => i.margin >= minMargin);
    }

    const data: any = await res.json();

    if (!data || !data.items) {
      console.warn("⚠️ Răspuns invalid de la Vinted, fallback la mock");
      return MOCK_ITEMS.filter((i) => i.margin >= minMargin);
    }

    // aici ai logica de procesare reală dacă vrei să extragi date din Vinted
    return data.items;
  } catch (e) {
    console.error("❌ Eroare la fetch:", e);
    return MOCK_ITEMS.filter((i) => i.margin >= minMargin);
  }
}
