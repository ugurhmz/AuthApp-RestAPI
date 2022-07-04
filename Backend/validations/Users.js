const Joi = require("joi");

// create validation
const createValidation = Joi.object({
  email: Joi.string().trim().email().required(),
  username: Joi.string().trim().required().min(3).max(40),
  password: Joi.string().min(6).required(),
  name: Joi.string().required().min(3).max(50),
  role: Joi.string(),
});

// login validation
const loginValidation = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
});

// reset-password validation
const resetPasswordValidation = Joi.object({
  email: Joi.string().trim().email().required(),
});

module.exports = {
  createValidation,
  loginValidation,
  resetPasswordValidation,
};
