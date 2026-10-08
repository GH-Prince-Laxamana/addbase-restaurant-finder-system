import Favorite from "../models/Favorite.js";

export async function findFavoritesByUser(userId) {
  return Favorite.find({
    user: userId,
  })
    .populate("restaurant")
    .sort({ createdAt: -1 });
}

export async function findFavorite(userId, restaurantId) {
  return Favorite.findOne({
    user: userId,
    restaurant: restaurantId,
  });
}

export async function createFavorite(userId, restaurantId) {
  return Favorite.create({
    user: userId,
    restaurant: restaurantId,
  });
}

export async function deleteFavorite(userId, restaurantId) {
  return Favorite.findOneAndDelete({
    user: userId,
    restaurant: restaurantId,
  });
}
