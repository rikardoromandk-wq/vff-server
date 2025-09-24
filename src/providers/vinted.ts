import fetch from "node-fetch";

const VINTED_BASE = "https://www.vinted.dk/api/v2/catalog/items";

export async function searchVinted(query: string) {
  try {
    const url = `${VINTED_BASE}?search_text=${encodeURIComponent(query)}&per_page=20&page=1`;

    const response = await fetch(url, {
      headers: {
        "accept": "application/json",
        "cookie": `secure_session=${process.env.VINTED_COOKIE}`,
        "user-agent": "Mozilla/5.0 (compatible; VFF/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Vinted API error ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (err) {
    console.error("❌ Eroare la fetch Vinted:", err);
    return [];
  }
}
