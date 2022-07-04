const mongoose = require("mongoose");
const logger = require("../logging/Users");

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
    activationToken: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.post("save", (obj) => {
  logger.log({
    level: "info",
    message: `${obj.name} saved.`,
  });
});

module.exports = mongoose.model("UserModel", UserSchema);
