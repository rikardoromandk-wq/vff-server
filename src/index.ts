import express from "express";
import cors from "cors";
import pino from "pino";
import router from "./routes/opportunities.js";

const app = express();
const log = pino();
const PORT = Number(process.env.PORT || 10000);

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("VFF server OK"));
app.use("/", router);

app.listen(PORT, () => {
  log.info({ msg: "server listening", port: PORT });
});
