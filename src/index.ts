import express from "express";
import cors from "cors";
import { opportunitiesRouter } from "./routes/opportunities.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// ✅ Aici montăm ruta
app.use("/opportunities", opportunitiesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
