import mongoose from "mongoose";

const { Schema } = mongoose;

const favoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      description: "User who favorited the restaurant.",
    },

    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      description: "Restaurant saved by the user.",
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
  },
);

favoriteSchema.index({ user: 1, restaurant: 1 }, { unique: true });

favoriteSchema.index({ user: 1, createdAt: -1 });

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
