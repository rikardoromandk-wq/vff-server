import express from "express";
import { getVintedItems } from "../providers/vinted.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = (req.query.q as string) || "";
    const minMargin = Number(req.query.minMargin || 20);

    const items = await getVintedItems(query, minMargin);
    res.json({ items, meta: { count: items.length } });
  } catch (err: any) {
    res.status(500).json({ error: "Eroare la preluarea datelor Vinted", detail: err.message });
  }
});

export default router;
