// src/index.ts
import express from "express";
import cors from "cors";
import router from "./routes/opportunities.js";

const app = express();

// middleware-uri de bază
app.use(cors());
app.use(express.json());

// rute
app.use("/", router);

// health check simplu
app.get("/healthz", (_, res) => {
  res.json({ ok: true });
});

// pornește serverul
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server live pe portul ${PORT}`);
});
