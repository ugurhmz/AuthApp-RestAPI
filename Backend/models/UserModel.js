const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "classic",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("UserModel", UserSchema);
