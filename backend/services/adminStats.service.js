import {
  getOverviewStats,
  getRestaurantStats,
} from "../repositories/adminStats.repository.js";

function parseRating(value) {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 5) {
    const error = new Error("Rating must be between 0 and 5.");

    error.statusCode = 400;
    error.code = "INVALID_RATING";
    throw error;
  }

  return parsed;
}

export async function getAdminOverview() {
  const stats = await getOverviewStats();

  return {
    restaurants: {
      total: stats.restaurants.total,
      active: stats.restaurants.active,
      inactive: stats.restaurants.inactive,
      averageRating: stats.restaurants.averageRating ?? 0,
    },
    users: stats.users,
    reviews: stats.reviews,
  };
}

export async function getAdminRestaurantStats(query) {
  return getRestaurantStats({
    q: query.q?.trim() || undefined,
    borough: query.borough?.trim() || undefined,
    cuisine: query.cuisine?.trim() || undefined,
    minRating: parseRating(query.minRating),
  });
}
