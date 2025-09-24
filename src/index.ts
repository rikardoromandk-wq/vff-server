import express from "express";
import cors from "cors";
import opportunitiesRouter from "./routes/opportunities.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS activat pentru toată aplicația
app.use(cors());

// ✅ JSON body parser
app.use(express.json());

// ✅ Montează ruta /opportunities
app.use("/opportunities", opportunitiesRouter);

// ✅ Ruta principală (test)
app.get("/", (_req, res) => {
  res.send("✅ VFF Server is running. Use /opportunities?q=Nike");
});

// ✅ Pornire server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
