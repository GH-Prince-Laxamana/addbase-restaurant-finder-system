import { getRestaurantById } from "../services/restaurantDetail.service.js";

export async function showRestaurant(req, res) {
  const restaurant = await getRestaurantById(req.params.id);

  res.json({
    restaurant,
  });
}
