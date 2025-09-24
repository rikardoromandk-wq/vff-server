import express from "express";
import { fetchVintedItems } from "../providers/vinted.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const q = req.query.q?.toString() || "";
    const minMargin = parseFloat(req.query.minMargin?.toString() || "0");

    console.log(`🔎 Received request: q="${q}", minMargin=${minMargin}`);

    const items = await fetchVintedItems(q, minMargin);

    console.log(`✅ Got ${items.length} items from Vinted (or fallback)`);

    res.json({ items, meta: { count: items.length } });
  } catch (error: any) {
    console.error("❌ Eroare la preluarea datelor Vinted:", error?.message || error);

    res.status(500).json({
      error: "Eroare la preluarea datelor Vinted",
      detail: error?.message || String(error),
    });
  }
});

export default router;
