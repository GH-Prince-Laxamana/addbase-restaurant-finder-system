import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";
import Review from "../models/Review.js";
import Favorite from "../models/Favorite.js";

export async function createRestaurant(data) {
  return Restaurant.create(data);
}

export async function findRestaurantById(id) {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  return Restaurant.findById(id);
}

export async function updateRestaurantById(id, updates) {
  return Restaurant.findByIdAndUpdate(
    id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    },
  );
}

export async function softDeleteRestaurant(id) {
  return Restaurant.findByIdAndUpdate(
    id,
    {
      $set: {
        isActive: false,
      },
    },
    {
      new: true,
    },
  );
}

export async function restoreRestaurant(id) {
  return Restaurant.findByIdAndUpdate(
    id,
    {
      $set: {
        isActive: true,
      },
    },
    {
      new: true,
    },
  );
}

export async function permanentlyDeleteRestaurant(id) {
  const session = await mongoose.startSession();

  try {
    let deletedRestaurant;

    await session.withTransaction(async () => {
      deletedRestaurant = await Restaurant.findByIdAndDelete(id, { session });

      if (!deletedRestaurant) {
        return;
      }

      await Review.deleteMany({ restaurant: id }, { session });

      await Favorite.deleteMany({ restaurant: id }, { session });
    });

    return deletedRestaurant;
  } finally {
    await session.endSession();
  }
}

export async function findAdminRestaurants({
  q,
  borough,
  cuisine,
  status,
  sort,
  page,
  limit,
}) {
  const match = {};

  if (status === "active") {
    match.isActive = true;
  } else if (status === "inactive") {
    match.isActive = false;
  }

  if (q) {
    match.$text = { $search: q };
  }

  if (borough) {
    match.borough = borough;
  }

  if (cuisine) {
    match.cuisine = cuisine;
  }

  const skip = (page - 1) * limit;

  const sortOptions = {
    name: { name: 1, _id: 1 },
    rating: { avgScore: -1, _id: 1 },
    reviews: { scoreCount: -1, _id: 1 },
  };

  const sortBy = sortOptions[sort] ?? sortOptions.name;

  let restaurantQuery = Restaurant.find(match);

  if (q && !sort) {
    restaurantQuery = restaurantQuery
      .select({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" }, name: 1 });
  } else {
    restaurantQuery = restaurantQuery.sort(sortBy);
  }

  const [results, total] = await Promise.all([
    restaurantQuery.skip(skip).limit(limit).lean(),
    Restaurant.countDocuments(match),
  ]);

  return {
    results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}
