import fs from "node:fs/promises";
import mongoose from "mongoose";
import env from "../config/env.js";
import Restaurant from "../models/Restaurant.js";

const dataPath = new URL("./restaurant.json", import.meta.url);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function transformRestaurant(source) {
  const restaurantId = normalizeString(source.restaurant_id);
  const name = normalizeString(source.name);
  const cuisine = normalizeString(source.cuisine);
  const borough = normalizeString(source.borough);

  const street = normalizeString(source.address?.street);
  const zipcode = normalizeString(source.address?.zipcode);
  const building = normalizeString(source.address?.building);

  const rawCoord = source.address?.coord;

  const coord =
    Array.isArray(rawCoord) &&
    rawCoord.length === 2 &&
    rawCoord.every((value) => Number.isFinite(Number(value)))
      ? rawCoord.map(Number)
      : undefined;

  if (!restaurantId || !name || !cuisine || !borough || !street || !zipcode) {
    return null;
  }

  return {
    restaurantId,
    name,
    cuisine,
    borough,
    address: {
      ...(building && { building }),
      street,
      zipcode,
      ...(coord && { coord }),
    },
  };
}

async function run() {
  try {
    await mongoose.connect(env.mongodbUri);

    const fileContents = await fs.readFile(dataPath, "utf8");
    const parsedData = JSON.parse(fileContents);

    const sourceRestaurants = Array.isArray(parsedData)
      ? parsedData
      : (parsedData.restaurants ?? [parsedData]);

    const uniqueRestaurants = new Map();

    for (const sourceRestaurant of sourceRestaurants) {
      const transformed = transformRestaurant(sourceRestaurant);

      if (transformed) {
        uniqueRestaurants.set(transformed.restaurantId, transformed);
      }
    }

    const restaurants = [...uniqueRestaurants.values()];

    if (restaurants.length === 0) {
      throw new Error("No valid restaurants found in restaurant.json.");
    }

    const operations = restaurants.map((restaurant) => ({
      updateOne: {
        filter: {
          restaurantId: restaurant.restaurantId,
        },
        update: {
          $set: {
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            borough: restaurant.borough,
            address: restaurant.address,
          },
          $setOnInsert: {
            avgScore: 0,
            scoreCount: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    const result = await Restaurant.bulkWrite(operations, {
      timestamps: false,
    });

    await Restaurant.createIndexes();

    const totalRestaurants = await Restaurant.countDocuments();

    console.log("Restaurant seed completed.");
    console.log(`Source records: ${sourceRestaurants.length}`);
    console.log(`Valid unique records: ${restaurants.length}`);
    console.log(`Inserted: ${result.upsertedCount}`);
    console.log(`Updated: ${result.modifiedCount}`);
    console.log(`Total restaurants: ${totalRestaurants}`);
  } catch (error) {
    console.error("Restaurant seed failed:", error.message);

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
