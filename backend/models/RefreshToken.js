import mongoose from "mongoose";

const { Schema } = mongoose;

const refreshTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      description: "User associated with the refresh token.",
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      description: "Hash of the refresh token JWT.",
    },

    expiresAt: {
      type: Date,
      required: true,
      description: "Time after which the refresh token can no longer be used.",
    },

    revokedAt: {
      type: Date,
      default: null,
      description: "Time when the refresh token was revoked.",
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

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ user: 1 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
