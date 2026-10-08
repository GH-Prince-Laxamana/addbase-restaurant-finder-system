import {
  createRestaurant,
  findRestaurantById,
  permanentlyDeleteRestaurant,
  restoreRestaurant,
  softDeleteRestaurant,
  updateRestaurantById,
} from "../repositories/adminRestaurant.repository.js";

const allowedUpdateFields = [
  "restaurantId",
  "name",
  "cuisine",
  "borough",
  "address",
];

function notFoundError() {
  const error = new Error("Restaurant not found.");
  error.statusCode = 404;
  error.code = "RESTAURANT_NOT_FOUND";
  return error;
}

function normalizeRestaurantInput(data) {
  return {
    ...(data.restaurantId !== undefined && {
      restaurantId: data.restaurantId.trim(),
    }),
    ...(data.name !== undefined && {
      name: data.name.trim(),
    }),
    ...(data.cuisine !== undefined && {
      cuisine: data.cuisine.trim(),
    }),
    ...(data.borough !== undefined && {
      borough: data.borough.trim(),
    }),
    ...(data.address !== undefined && {
      address: {
        ...(data.address.building !== undefined && {
          building: data.address.building.trim(),
        }),
        ...(data.address.street !== undefined && {
          street: data.address.street.trim(),
        }),
        ...(data.address.zipcode !== undefined && {
          zipcode: data.address.zipcode.trim(),
        }),
        ...(data.address.coord !== undefined && {
          coord: data.address.coord,
        }),
      },
    }),
  };
}

export async function addRestaurant(data) {
  return createRestaurant(normalizeRestaurantInput(data));
}

export async function editRestaurant(id, data) {
  const restaurant = await findRestaurantById(id);

  if (!restaurant) {
    throw notFoundError();
  }

  const updates = {};

  for (const field of allowedUpdateFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  const normalized = normalizeRestaurantInput(updates);

  if (Object.keys(normalized).length === 0) {
    const error = new Error("No editable restaurant fields were provided.");

    error.statusCode = 400;
    error.code = "NO_UPDATABLE_FIELDS";

    throw error;
  }

  return updateRestaurantById(id, normalized);
}

export async function deactivateRestaurant(id) {
  const restaurant = await softDeleteRestaurant(id);

  if (!restaurant) {
    throw notFoundError();
  }

  return restaurant;
}

export async function reactivateRestaurant(id) {
  const restaurant = await restoreRestaurant(id);

  if (!restaurant) {
    throw notFoundError();
  }

  return restaurant;
}

export async function permanentlyRemoveRestaurant(id) {
  const restaurant = await permanentlyDeleteRestaurant(id);

  if (!restaurant) {
    throw notFoundError();
  }

  return restaurant;
}
