import { findRestaurants } from "../repositories/restaurant.repository.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseRating(value) {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 5
    ? parsed
    : undefined;
}

export async function getRestaurants(query) {
  const page = parsePositiveInteger(query.page, DEFAULT_PAGE);

  const limit = Math.min(
    parsePositiveInteger(query.limit, DEFAULT_LIMIT),
    MAX_LIMIT,
  );

  const minRating = parseRating(query.minRating);
  const maxRating = parseRating(query.maxRating);

  if (
    minRating !== undefined &&
    maxRating !== undefined &&
    minRating > maxRating
  ) {
    const error = new Error(
      "Minimum rating cannot be greater than maximum rating.",
    );

    error.statusCode = 400;
    error.code = "INVALID_RATING_RANGE";

    throw error;
  }

  const result = await findRestaurants({
    q: query.q?.trim() || undefined,
    borough: query.borough?.trim() || undefined,
    cuisine: query.cuisine?.trim() || undefined,
    minRating,
    maxRating,
    sort: query.sort,
    page,
    limit,
  });

  const total = result.pagination[0]?.total ?? 0;

  return {
    results: result.results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
    facets: {
      cuisine: result.cuisine,
      borough: result.borough,
      rating: result.rating,
    },
  };
}
