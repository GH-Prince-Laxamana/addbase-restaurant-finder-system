import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      description: "Display name of the user.",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      description: "Unique email address used for authentication.",
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
      description:
        "Secure password hash. Excluded from normal Mongoose queries.",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      description:
        "Determines whether the account has regular user or administrator access.",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
