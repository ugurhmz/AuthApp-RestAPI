const httpStatus = require("http-status");
const { restart } = require("nodemon");
const UserModel = require("../models/UserModel");

const verifyEmail = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user.isVerified) {
      next();
    } else {
      return restart
        .status(httpStatus.BAD_REQUEST)
        .json("Please check your email verify!");
    }
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json("Please check your email verify!");
  }
};

module.exports = { verifyEmail };
