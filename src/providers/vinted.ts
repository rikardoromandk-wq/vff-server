import fetch from "node-fetch";

export async function getVintedItems(query: string, minMargin: number) {
  try {
    const url = `https://www.vinted.dk/api/v2/catalog/items?search_text=${encodeURIComponent(
      query
    )}&order=newest_first`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Vinted ${response.status}`);
    }

    const data: any = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
      throw new Error("Nu s-au găsit produse");
    }

    const items = data.items
      .map((item: any) => {
        const priceBuy = item.price_numeric;
        const expectedSell = priceBuy * 1.8;
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
