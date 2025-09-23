import fetch from "node-fetch";

export async function getVintedItems(query: string, minMargin: number) {
  try {
    const url = `https://www.vinted.dk/api/v2/catalog/items?search_text=${encodeURIComponent(query)}&order=newest_first`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0", // foarte important, Vinted blochează requesturile fără UA
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Vinted ${response.status}`);
    }

    const data = await response.json();

    // transformăm rezultatul în formatul tău de UI
    const items = data.items.map((item: any) => {
      const priceBuy = item.price_numeric;
      const expectedSell = priceBuy * 1.8; // simplu: estimăm profit 80% peste cumpărare
      const shipping = 45;
      const fees = 20;

      const totalCost = priceBuy + shipping + fees;
      const profit = expectedSell - totalCost;
      const margin = (profit / totalCost) * 100;

      return {
        id: item.id,
        title: item.title,
        brand: item.brand?.title || "Necunoscut",
        priceBuy,
        shipping,
        fees,
        expectedSell: Math.round(expectedSell),
        lastSoldPrice: priceBuy,
        lastSoldDate: new Date().toISOString().split("T")[0],
        condition: item.status || "Bun",
        size: item.size_title,
        image: item.photo?.url,
        url: `https://www.vinted.dk/items/${item.id}`,
        comps: [],
        totalCost,
        profit,
        margin,
        confidence: 0.5,
      };
    }).filter((item: any) => item.margin >= minMargin);

    return items;
  } catch (err) {
    console.error("Eroare la fetch Vinted:", err);
    throw err;
  }
}
