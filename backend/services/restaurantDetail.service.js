import { findRestaurantById } from "../repositories/restaurantDetail.repository.js";

export async function getRestaurantById(id) {
  const restaurant = await findRestaurantById(id);

  if (!restaurant) {
    const error = new Error("Restaurant not found.");
    error.statusCode = 404;
    error.code = "RESTAURANT_NOT_FOUND";
    throw error;
  }

  return restaurant;
}
