import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      description: "Restaurant being reviewed.",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      description: "User who authored the review.",
    },

    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Review score must be a whole number from 1 to 5.",
      },
      description: "User rating from 1 to 5.",
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
      description: "Written review provided by the user.",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

reviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });

reviewSchema.index({ restaurant: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
