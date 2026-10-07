import mongoose from "mongoose";

const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    building: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    zipcode: {
      type: String,
      required: true,
      trim: true,
    },
    coord: {
      type: [Number],
      validate: {
        validator: (value) => value.length === 2,
        message: "Coordinates must contain longitude and latitude.",
      },
    },
  },
  { _id: false },
);

const restaurantSchema = new Schema(
  {
    restaurantId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      description:
        "Unique identifier preserved from the original restaurant dataset.",
    },

    name: {
      type: String,
      required: true,
      trim: true,
      description: "Name of the restaurant.",
    },

    cuisine: {
      type: String,
      required: true,
      trim: true,
      description: "Primary cuisine served by the restaurant.",
    },

    borough: {
      type: String,
      required: true,
      trim: true,
      description: "New York City borough where the restaurant is located.",
    },

    address: {
      type: addressSchema,
      required: true,
      description: "Physical address and optional geographic coordinates.",
    },

    avgScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      description:
        "Denormalized average review score maintained from the reviews collection.",
    },

    scoreCount: {
      type: Number,
      default: 0,
      min: 0,
      description:
        "Number of user reviews currently contributing to the restaurant score.",
    },

    isActive: {
      type: Boolean,
      default: true,
      description:
        "Controls whether the restaurant is visible in public listings.",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

restaurantSchema.index(
  { name: "text", cuisine: "text" },
  {
    weights: {
      name: 5,
      cuisine: 2,
    },
  },
);

restaurantSchema.index({ borough: 1, cuisine: 1 });
restaurantSchema.index({ avgScore: -1 });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
