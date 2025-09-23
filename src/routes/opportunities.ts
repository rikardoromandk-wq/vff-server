import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { VintedProvider } from "../providers/vinted.js";
import { scoreListing, sortByKey } from "../scoring.js";
import { env } from "../config.js";

const querySchema = z.object({
  q: z.string().optional(),                 // text căutare (brand, model etc)
  brand: z.string().optional(),
  minMargin: z.coerce.number().min(0).max(95).default(20),
  highConf: z.coerce.boolean().default(false),
  sort: z.enum(["score", "profit", "margin", "recency"]).default("score"),
  limit: z.coerce.number().min(1).max(100).default(30)
});

export const router = Router();

router.get("/opportunities", async (req: Request, res: Response) => {
  const q = querySchema.safeParse(req.query);
  if (!q.success) return res.status(400).json({ error: q.error.flatten() });

  const { q: query, brand, minMargin, highConf, sort, limit } = q.data;

  try {
    const raw = await VintedProvider.getRecentListings({ query, brand });

    const scored = raw.map(scoreListing)
      .filter(i => i.margin >= minMargin)
      .filter(i => (highConf ? i.confidence >= env.MIN_CONFIDENCE_HIGH : true));

    const sorted = sortByKey(scored, sort).slice(0, limit);
    res.json({ items: sorted, meta: { count: sorted.length } });
  } catch (e: any) {
    res.status(502).json({ error: "Eroare la preluarea datelor Vinted", detail: String(e?.message ?? e) });
  }
});
