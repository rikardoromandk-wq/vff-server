// src/routes/opportunities.ts
import express from "express";
import { fetchVintedItems } from "../providers/vinted.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const query = (req.query.q as string) || "";
  const minMargin = parseFloat((req.query.minMargin as string) || "0");

  try {
    const items = await fetchVintedItems(query, minMargin);

    // aici putem filtra și sorta
    const filtered = (items as any[]).filter((i: any) => i.margin >= minMargin);
    const sorted = filtered.sort((a: any, b: any) => b.profit - a.profit);

    res.json({ items: sorted, meta: { count: sorted.length } });
  } catch (err) {
    console.error("Eroare la preluare:", err);
    res.status(500).json({ error: "Eroare server" });
  }
});

export default router;
