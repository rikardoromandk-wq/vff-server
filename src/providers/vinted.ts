import fetch from "node-fetch";

export async function getVintedItems(query: string) {
  try {
    const url = `https://www.vinted.dk/api/v2/catalog/items?search_text=${encodeURIComponent(query)}&per_page=5`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
      },
    });

    if (!res.ok) {
      console.error("Vinted API error", res.status);
      throw new Error(`Vinted API error: ${res.status}`);
    }

    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("Eroare Vinted:", error);

    // Fallback: date mock ca să nu fie aplicația goală
    return [
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
  }
}
