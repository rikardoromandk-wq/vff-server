import express from "express";
import cors from "cors";
import pino from "pino";
import { env } from "./config.js";
import { router as opportunities } from "./routes/opportunities.js";

const app = express();
const log = pino({ level: "info" });

app.use(cors({ origin: (_origin, cb) => cb(null, true) }));
app.use(express.json());

app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.use(opportunities);

app.listen(env.PORT, () => log.info(`server listening on :${env.PORT}`));
