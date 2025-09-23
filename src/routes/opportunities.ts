import { Router } from "express";
import { getVintedItems } from "../providers/vinted.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const query = (req.query.q as string) || "Nike";
    const minMargin = Number(req.query.minMargin || 20);

    const items = await getVintedItems(query, minMargin);
    res.json({ items, meta: { count: items.length } });
  } catch (err: any) {
    console.error("Eroare la preluarea datelor:", err);
    res.status(500).json({ error: "Eroare la preluarea datelor Vinted" });
  }
});

export default router;
