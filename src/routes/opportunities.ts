import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { getVintedItems } from "../providers/vinted.js";

const router = Router();

const querySchema = z.object({
  q: z.string().optional().default(""),
  minMargin: z.coerce.number().optional().default(0)
});

router.get("/opportunities", async (req: Request, res: Response) => {
  const q = querySchema.safeParse(req.query);
  if (!q.success) return res.status(400).json({ error: q.error.flatten() });

  try {
    const items = await getVintedItems(q.data.q, q.data.minMargin);
    return res.json({ items, meta: { count: items.length } });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "Eroare la preluarea datelor Vinted", detail: String(err?.message || err) });
  }
});

export default router;
