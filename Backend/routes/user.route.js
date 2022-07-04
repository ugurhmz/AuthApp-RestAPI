const express = require("express");
const validate = require("../middlewares/validate");
const router = express.Router();
const schemas = require("../validations/Users");

const { verifyEmail } = require("../middlewares/verifyEmail");
const {
  registerController,
  userActivationController,
  loginController,
} = require("../controllers/Users.js");

// ROUTING
router.post(
  "/register",
  validate(schemas.createValidation),
  registerController
);

router.get("/activation/:token", userActivationController);
router.post("/login", verifyEmail, loginController);

module.exports = router;
