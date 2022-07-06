const httpStatus = require("http-status");
const { restart } = require("nodemon");
const UserModel = require("../models/UserModel");

const jwt = require("jsonwebtoken");

// TOKEN VERIFY
const tokenVerify = async (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const splitToken = authHeader.split(" ")[1];
    try {
      const decode = jwt.verify(splitToken, process.env.JWT_SECURITY);
      const user = await UserModel.findById(decode.id);
      if (!user) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ msg: "Unauthorized access!" });
      }
      console.log("user", user);
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ msg: "Unauthorized access!" });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(httpStatus.NETWORK_AUTHENTICATION_REQUIRED).json({
          msg: "Session expired try sign in!",
        });
      }

      res.res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ msg: "Internal server error!" });
    }
  } else {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: "Unauthorized access!" });
  }
};

// VERIFY EMAIL
const verifyEmail = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "User not found, try again!",
      });
    }

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

module.exports = { verifyEmail, tokenVerify };
