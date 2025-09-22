import type { Provider, RawListing } from "./types.js";

const DATA: RawListing[] = [
  {
    id: "1",
    title: "Nike Dunk Low Panda",
    brand: "Nike",
    priceBuy: 450,
    shipping: 40,
    fees: 25,
    expectedSell: 700,
    lastSoldPrice: 680,
    lastSoldDate: "2025-09-01",
    condition: "Foarte bun",
    size: "EU 42",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    url: "https://www.vinted.dk/",
    comps: [
      { price: 680, date: "2025-09-01" },
      { price: 720, date: "2025-08-22" },
      { price: 690, date: "2025-08-10" }
    ]
  },
  {
    id: "2",
    title: "Levi's 501 Vintage Blue",
    brand: "Levi's",
    priceBuy: 120,
    shipping: 39,
    fees: 12,
    expectedSell: 300,
    lastSoldPrice: 310,
    lastSoldDate: "2025-08-28",
    condition: "Bun",
    size: "W32 L32",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
    url: "https://www.vinted.dk/",
    comps: [
      { price: 295, date: "2025-08-28" },
      { price: 320, date: "2025-08-15" }
    ]
  },
  {
    id: "3",
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
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
    url: "https://www.vinted.dk/",
    comps: [
      { price: 640, date: "2025-09-05" },
      { price: 660, date: "2025-08-18" }
    ]
  }
];

export const MockProvider: Provider = {
  async getRecentListings({ query, brand } = {}) {
    const q = (query || "").toLowerCase();
    return DATA.filter(
      d =>
        (!brand || d.brand === brand) &&
        (!q || `${d.title} ${d.brand} ${d.size ?? ""}`.toLowerCase().includes(q))
    );
  }
};
