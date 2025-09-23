import { Router } from "express";
import { VintedProvider } from "../providers/vinted.js";

export const opportunitiesRouter = Router();

opportunitiesRouter.get("/", async (req, res) => {
  try {
    const { q, minMargin } = req.query;
    const data = await VintedProvider({
      query: q as string,
      minMargin: minMargin ? Number(minMargin) : 0,
    });

    res.json({ items: data, meta: { count: data.length } });
  } catch (err) {
    console.error("Eroare la preluarea datelor Vinted:", err);
    res.status(500).json({ error: "Eroare la preluarea datelor Vinted" });
  }
});
