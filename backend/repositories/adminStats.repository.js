import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";
import Review from "../models/Review.js";

export async function getOverviewStats() {
  const [restaurantStats, userCount, reviewCount] = await Promise.all([
    Restaurant.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: ["$isActive", 1, 0],
            },
          },
          inactive: {
            $sum: {
              $cond: ["$isActive", 0, 1],
            },
          },
          averageRating: {
            $avg: {
              $cond: [
                {
                  $gt: ["$scoreCount", 0],
                },
                "$avgScore",
                null,
              ],
            },
          },
        },
      },
    ]),
    User.countDocuments(),
    Review.countDocuments(),
  ]);

  return {
    restaurants: restaurantStats[0] ?? {
      total: 0,
      active: 0,
      inactive: 0,
      averageRating: 0,
    },
    users: userCount,
    reviews: reviewCount,
  };
}

function buildRestaurantMatch({ q, borough, cuisine, minRating }) {
  const match = {
    isActive: true,
  };

  if (q) {
    match.$text = {
      $search: q,
    };
  }

  if (borough) {
    match.borough = borough;
  }

  if (cuisine) {
    match.cuisine = cuisine;
  }

  if (minRating !== undefined) {
    match.avgScore = {
      $gte: minRating,
    };
  }

  return match;
}

export async function getRestaurantStats(filters) {
  const match = buildRestaurantMatch(filters);

  const [result] = await Restaurant.aggregate([
    {
      $match: match,
    },
    {
      $facet: {
        topRated: [
          {
            $match: {
              scoreCount: {
                $gt: 0,
              },
            },
          },
          {
            $sort: {
              avgScore: -1,
              scoreCount: -1,
              name: 1,
            },
          },
          {
            $limit: 10,
          },
          {
            $project: {
              _id: 1,
              restaurantId: 1,
              name: 1,
              cuisine: 1,
              borough: 1,
              avgScore: 1,
              scoreCount: 1,
            },
          },
        ],

        mostReviewed: [
          {
            $sort: {
              scoreCount: -1,
              avgScore: -1,
              name: 1,
            },
          },
          {
            $limit: 10,
          },
          {
            $project: {
              _id: 1,
              restaurantId: 1,
              name: 1,
              cuisine: 1,
              borough: 1,
              avgScore: 1,
              scoreCount: 1,
            },
          },
        ],

        byCuisine: [
          {
            $group: {
              _id: "$cuisine",
              restaurantCount: {
                $sum: 1,
              },
              averageRating: {
                $avg: "$avgScore",
              },
              reviewCount: {
                $sum: "$scoreCount",
              },
            },
          },
          {
            $sort: {
              restaurantCount: -1,
              _id: 1,
            },
          },
        ],

        byBorough: [
          {
            $group: {
              _id: "$borough",
              restaurantCount: {
                $sum: 1,
              },
              averageRating: {
                $avg: "$avgScore",
              },
              reviewCount: {
                $sum: "$scoreCount",
              },
            },
          },
          {
            $sort: {
              restaurantCount: -1,
              _id: 1,
            },
          },
        ],
      },
    },
  ]);

  return result;
}
