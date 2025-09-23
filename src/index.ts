import express from "express";
import cors from "cors";
import opportunities from "./routes/opportunities.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Răspuns simplu pe ruta principală "/"
app.get("/", (req, res) => {
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
