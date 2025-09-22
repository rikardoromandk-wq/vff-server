export type RawListing = {
  id: string;
  title: string;
  brand: string;
  priceBuy: number;
  shipping?: number;
  fees?: number;
  expectedSell: number;
  lastSoldPrice?: number;
  lastSoldDate?: string;
  condition: "Nou" | "Foarte bun" | "Bun" | "Ok";
  size?: string;
  image: string;
  url: string;
  comps?: { price: number; date: string }[];
};

export type Provider = {
  getRecentListings: (opts?: { query?: string; brand?: string }) => Promise<RawListing[]>;
};
