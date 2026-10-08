import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";

export async function findRestaurantById(id) {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  const [restaurant] = await Restaurant.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        isActive: true,
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurant",
        as: "reviews",
      },
    },
    {
      $unwind: {
        path: "$reviews",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reviews.user",
        foreignField: "_id",
        as: "reviewUser",
      },
    },
    {
      $unwind: {
        path: "$reviewUser",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        restaurantId: { $first: "$restaurantId" },
        name: { $first: "$name" },
        cuisine: { $first: "$cuisine" },
        borough: { $first: "$borough" },
        address: { $first: "$address" },
        avgScore: { $first: "$avgScore" },
        scoreCount: { $first: "$scoreCount" },
        isActive: { $first: "$isActive" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        reviews: {
          $push: {
            $cond: [
              { $ne: ["$reviews", null] },
              {
                id: "$reviews._id",
                score: "$reviews.score",
                comment: "$reviews.comment",
                user: {
                  id: "$reviewUser._id",
                  name: "$reviewUser.name",
                },
                createdAt: "$reviews.createdAt",
                updatedAt: "$reviews.updatedAt",
              },
              null,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
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
        reviews: {
          $filter: {
            input: "$reviews",
            as: "review",
            cond: {
              $ne: ["$$review", null],
            },
          },
        },
      },
    },
  ]);

  return restaurant ?? null;
}
