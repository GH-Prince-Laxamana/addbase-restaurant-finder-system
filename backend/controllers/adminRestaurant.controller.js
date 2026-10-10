import {
  addRestaurant,
  deactivateRestaurant,
  editRestaurant,
  permanentlyRemoveRestaurant,
  reactivateRestaurant,
  getAdminRestaurantList,
} from "../services/adminRestaurant.service.js";

export async function createRestaurant(req, res) {
  const restaurant = await addRestaurant(req.body);

  res.status(201).json({
    restaurant,
  });
}

export async function updateRestaurant(req, res) {
  const restaurant = await editRestaurant(req.params.id, req.body);

  res.json({
    restaurant,
  });
}

export async function deleteRestaurant(req, res) {
  const restaurant = await deactivateRestaurant(req.params.id);

  res.json({
    restaurant,
  });
}

export async function restoreRestaurant(req, res) {
  const restaurant = await reactivateRestaurant(req.params.id);

  res.json({
    restaurant,
  });
}

export async function permanentlyDeleteRestaurant(req, res) {
  await permanentlyRemoveRestaurant(req.params.id);

  res.status(204).send();
}

export async function listAdminRestaurants(req, res) {
  const data = await getAdminRestaurantList(req.query);

  res.json(data);
}
