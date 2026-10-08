import Restaurant from "../models/Restaurant.js";
import {
  createFavorite,
  deleteFavorite,
  findFavorite,
  findFavoritesByUser,
} from "../repositories/favorite.repository.js";

export async function getUserFavorites(userId) {
  return findFavoritesByUser(userId);
}

export async function addFavorite(userId, restaurantId) {
  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    isActive: true,
  });

  if (!restaurant) {
    const error = new Error("Restaurant not found.");
    error.statusCode = 404;
    error.code = "RESTAURANT_NOT_FOUND";
    throw error;
  }

  const existingFavorite = await findFavorite(userId, restaurantId);

  if (existingFavorite) {
    const error = new Error("Restaurant is already in your favorites.");
    error.statusCode = 409;
    error.code = "FAVORITE_ALREADY_EXISTS";
    throw error;
  }

  return createFavorite(userId, restaurantId);
}

export async function removeFavorite(userId, restaurantId) {
  const favorite = await deleteFavorite(userId, restaurantId);

  if (!favorite) {
    const error = new Error("Restaurant is not in your favorites.");
    error.statusCode = 404;
    error.code = "FAVORITE_NOT_FOUND";
    throw error;
  }
}
