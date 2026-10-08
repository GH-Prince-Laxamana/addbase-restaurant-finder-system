import Restaurant from "../models/Restaurant.js";

export async function findRestaurants({
  q,
  borough,
  cuisine,
  minRating,
  maxRating,
  sort,
  page,
  limit,
}) {
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

  if (minRating !== undefined || maxRating !== undefined) {
    match.avgScore = {};

    if (minRating !== undefined) {
      match.avgScore.$gte = minRating;
    }

    if (maxRating !== undefined) {
      match.avgScore.$lte = maxRating;
    }
  }

  const skip = (page - 1) * limit;

  const sortStage =
    sort === "name"
      ? { $sort: { name: 1, _id: 1 } }
      : sort === "reviews"
        ? { $sort: { scoreCount: -1, _id: 1 } }
        : sort === "rating"
          ? { $sort: { avgScore: -1, _id: 1 } }
          : q
            ? {
                $sort: {
                  score: { $meta: "textScore" },
                  name: 1,
                },
              }
            : {
                $sort: {
                  avgScore: -1,
                  name: 1,
                  _id: 1,
                },
              };

  const [result] = await Restaurant.aggregate([
    {
      $match: match,
    },
    {
      $facet: {
        results: [
          sortStage,
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              restaurantId: 1,
              name: 1,
              cuisine: 1,
              borough: 1,
              address: 1,
              avgScore: 1,
              scoreCount: 1,
              isActive: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],

        pagination: [
          {
            $count: "total",
          },
        ],

        cuisine: [
          {
            $group: {
              _id: "$cuisine",
              count: { $sum: 1 },
            },
          },
          {
            $sort: {
              count: -1,
              _id: 1,
            },
          },
        ],

        borough: [
          {
            $group: {
              _id: "$borough",
              count: { $sum: 1 },
            },
          },
          {
            $sort: {
              count: -1,
              _id: 1,
            },
          },
        ],

        rating: [
          {
            $bucket: {
              groupBy: "$avgScore",
              boundaries: [0, 1, 2, 3, 4, 5, 6],
              default: null,
              output: {
                count: { $sum: 1 },
              },
            },
          },
        ],
      },
    },
  ]);

  return result;
}
