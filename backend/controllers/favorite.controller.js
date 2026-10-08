import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
} from "../services/favorite.service.js";

export async function listFavorites(req, res) {
  const favorites = await getUserFavorites(req.user.id);

  res.json({
    favorites,
  });
}

export async function createFavorite(req, res) {
  const favorite = await addFavorite(req.user.id, req.params.id);

  res.status(201).json({
    favorite,
  });
}

export async function deleteFavorite(req, res) {
  await removeFavorite(req.user.id, req.params.id);

  res.status(204).send();
}
