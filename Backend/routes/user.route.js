const express = require("express");
const validate = require("../middlewares/validate");
const router = express.Router();
const schemas = require("../validations/Users");

const {
  registerController,
  userActivationController,
} = require("../controllers/Users.js");

// ROUTING
router.post(
  "/register",
  validate(schemas.createValidation),
  registerController
);

router.get("/activation/:token", userActivationController);

module.exports = router;
