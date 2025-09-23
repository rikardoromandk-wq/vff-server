import express from "express";
import cors from "cors";
import opportunitiesRouter from "./routes/opportunities.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Montăm ruta corect
app.use("/opportunities", opportunitiesRouter);

app.get("/healthz", (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server live pe portul ${PORT}`);
});
