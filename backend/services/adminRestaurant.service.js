import {
  createRestaurant,
  findAdminRestaurants,
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
  try {
    return await createRestaurant(normalizeRestaurantInput(data));
  } catch (error) {
    if (error?.code === 11000) {
      const conflictError = new Error(
        "A restaurant with this restaurant ID already exists.",
      );

      conflictError.statusCode = 409;
      conflictError.code = "RESTAURANT_ID_ALREADY_EXISTS";

      throw conflictError;
    }

    throw error;
  }
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
  const existingRestaurant = await findRestaurantById(id);

  if (!existingRestaurant) {
    throw notFoundError();
  }

  if (existingRestaurant.isActive) {
    const error = new Error(
      "Deactivate the restaurant before permanently deleting it.",
    );

    error.statusCode = 409;
    error.code = "RESTAURANT_MUST_BE_INACTIVE";

    throw error;
  }

  const restaurant = await permanentlyDeleteRestaurant(id);

  if (!restaurant) {
    throw notFoundError();
  }

  return restaurant;
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function getAdminRestaurantList(query) {
  const page = parsePositiveInteger(query.page, 1);
  const limit = Math.min(parsePositiveInteger(query.limit, 20), 50);

  const status = query.status || "all";

  if (!["all", "active", "inactive"].includes(status)) {
    const error = new Error("Status must be all, active, or inactive.");
    error.statusCode = 400;
    error.code = "INVALID_RESTAURANT_STATUS";
    throw error;
  }

  const sort = query.sort || "name";

  if (!["name", "rating", "reviews"].includes(sort)) {
    const error = new Error("Sort must be name, rating, or reviews.");
    error.statusCode = 400;
    error.code = "INVALID_SORT";
    throw error;
  }

  return findAdminRestaurants({
    q: query.q?.trim() || undefined,
    borough: query.borough?.trim() || undefined,
    cuisine: query.cuisine?.trim() || undefined,
    status,
    sort,
    page,
    limit,
  });
}
