const express = require("express");
const validate = require("../middlewares/validate");
const router = express.Router();
const schemas = require("../validations/Users");

const { registerController } = require("../controllers/Users.js");

router.post(
  "/register",
  validate(schemas.createValidation),
  registerController
);

module.exports = router;
