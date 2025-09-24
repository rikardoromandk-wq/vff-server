import { FastifyInstance } from "fastify";
import { fetchVintedItems } from "../providers/vinted.js";

export default async function opportunitiesRoutes(fastify: FastifyInstance) {
  fastify.get("/opportunities", async (request, reply) => {
    try {
      // ✅ 1. Citim query params
      const { q, minMargin } = request.query as {
        q?: string;
        minMargin?: string;
      };

      // ✅ 2. Facem fetch la produse de pe Vinted (folosim doar query-ul)
      const items = await fetchVintedItems(q ?? "");

      // ✅ 3. Filtrăm după minMargin dacă e setat
      let filteredItems = items;
      if (minMargin) {
        const min = parseFloat(minMargin);
        if (!isNaN(min)) {
          filteredItems = items.filter((item) => {
            const price = parseFloat(item.price.amount);
            return price >= min;
          });
        }
      }

      // ✅ 4. Returnăm datele ca JSON
      return reply.send({
        items: filteredItems,
        meta: { count: filteredItems.length },
      });

    } catch (error) {
      console.error("❌ Error in /opportunities route:", error);
      return reply.status(500).send({ error: "Internal server error" });
    }
  });
}
