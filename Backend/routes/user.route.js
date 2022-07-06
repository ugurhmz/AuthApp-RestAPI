const express = require("express");
const validate = require("../middlewares/validate");
const router = express.Router();
const schemas = require("../validations/Users");

const {
  verifyEmail,
  tokenVerify,
} = require("../middlewares/verifyEmailAndToken");
const {
  registerController,
  userActivationController,
  loginController,
  resetPasswordController,
  logOutController,
} = require("../controllers/Users.js");

// REGISTER
router.post(
  "/register",
  validate(schemas.createValidation),
  registerController
);

// ACTIVATION
router.get("/activation/:token", userActivationController);

// LOGIN
router.post(
  "/login",
  validate(schemas.loginValidation),
  verifyEmail,
  loginController
);

// RESET-PASSWORD
router.post(
  "/reset-password",
  validate(schemas.resetPasswordValidation),
  resetPasswordController
);

// LOGOUT
router.post("/logout", tokenVerify, logOutController);

module.exports = router;
