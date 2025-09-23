import express, { Request, Response } from "express";
import cors from "cors";
import pino from "pino";
import { env } from "./config.js";
import { router as opportunities } from "./routes/opportunities.js";

const app = express();
const log = pino({ level: "info" });

// Middleware
app.use(cors());
app.use(express.json());

// Health check pentru Render
app.get("/healthz", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// Ruta principală "/" – doar pentru test
app.get("/", (_req: Request, res: Response) => {
  res.json({
    items: [
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
        image:
          "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
        url: "https://www.vinted.dk/",
        comps: [
          { price: 640, date: "2025-09-05" },
          { price: 660, date: "2025-08-18" },
        ],
        totalCost: 480,
        profit: 170,
        margin: 35.41,
        confidence: 0.5,
      },
    ],
  });
});

// Router pentru oportunități
app.use(opportunities);

// Pornire server
const PORT = process.env.PORT || env.PORT || 10000;
app.listen(PORT, () => {
  log.info(`Server listening on port ${PORT}`);
});
