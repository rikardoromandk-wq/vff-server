import express, { type Request, type Response } from "express";
import cors from "cors";
import pino from "pino";
import { env } from "./config.js";
import { router as opportunities } from "./routes/opportunities.js";

const app = express();
const log = pino({ level: "info" });

// CORS permis (simplu) — fără delegate care cere tipuri
app.use(cors());
app.use(express.json());

app.get("/healthz", (_req: Request, res: Response) => res.json({ ok: true }));
app.use(opportunities);

app.listen(env.PORT, () => log.info(`server listening on :${env.PORT}`));
