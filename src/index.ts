import express, { Request, Response } from "express";
import cors from "cors";
import pino from "pino";
import { env } from "./config.js";
import { router as opportunities } from "./routes/opportunities.js";

const app = express();
const log = pino({ level: "info" });

// Middleware-uri
app.use(cors());
app.use(express.json());

// Health check
app.get("/healthz", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// Rute pentru oportunități
app.use(opportunities);

// Răspuns pe ruta principală "/"
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
          "https://images.unsplash.com/photo-1520975916090-3105956
