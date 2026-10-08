import { getRestaurants } from "../services/restaurant.service.js";

export async function listRestaurants(req, res) {
  const data = await getRestaurants(req.query);

  res.json(data);
}
