import fetch from "node-fetch";

function buildUrl(query: string, page = 1, perPage = 20) {
  const u = new URL("https://www.vinted.dk/api/v2/catalog/items");
  u.searchParams.set("search_text", query);
  u.searchParams.set("order", "newest_first");
  u.searchParams.set("page", String(page));
  u.searchParams.set("per_page", String(perPage));
  // anti-cache ca să evităm 304
  u.searchParams.set("_ts", String(Date.now()));
  return u.toString();
}

export async function getVintedItems(query: string, minMargin: number) {
  const url = buildUrl(query || "", 1, 20);

  const cookie = process.env.VINTED_COOKIE || "";
  if (!cookie) {
    throw new Error("Lipsește VINTED_COOKIE în Environment Variables pe Render.");
  }

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.vinted.dk/",
    // cookie-ul tău de sesiune
    "Cookie": cookie,
    // încercăm să evităm răspunsurile din cache intermediar
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
  };

  // mic retry în caz de 403/401
  for (let attempt = 1; attempt <= 2; attempt++) {
    const res = await fetch(url, { headers });

    // 304 nu are body util -> încercăm încă o dată cu alt _ts
    if (res.status === 304) continue;
    if (!res.ok) {
      if (attempt === 2) {
        throw new Error(`Vinted ${res.status}`);
      }
      await new Promise((r) => setTimeout(r, 500));
      continue;
    }

    const data: any = await res.json();
    const itemsArray = Array.isArray(data?.items) ? data.items : [];

    const items = itemsArray
      .map((item: any) => {
        const priceBuy = Number(item?.price_numeric ?? 0);
        const shipping = 45;
        const fees = 20;
        const expectedSell = Math.round(priceBuy * 1.8);

        const totalCost = priceBuy + shipping + fees;
        const profit = expectedSell - totalCost;
        const margin = totalCost ? (profit / totalCost) * 100 : 0;

        return {
          id: item?.id,
          title: item?.title || "Fără titlu",
          brand: item?.brand?.title || "Necunoscut",
          priceBuy,
          shipping,
          fees,
          expectedSell,
          lastSoldPrice: priceBuy,
          lastSoldDate: new Date().toISOString().slice(0, 10),
          condition: item?.status || "Bun",
          size: item?.size_title || "",
          image: item?.photo?.url,
          url: item?.id ? `https://www.vinted.dk/items/${item.id}` : "https://www.vinted.dk/",
          comps: [],
          totalCost,
          profit,
          margin: Number(margin.toFixed(2)),
          confidence: 0.6,
        };
      })
      .filter((it: any) => it.margin >= minMargin)
      // ordonează descrescător după profit
      .sort((a: any, b: any) => b.profit - a.profit);

    return items;
  }

  // dacă ajungem aici, nu am reușit să obținem 200
  throw new Error("Nu s-au putut obține date de la Vinted (după retry).");
}
