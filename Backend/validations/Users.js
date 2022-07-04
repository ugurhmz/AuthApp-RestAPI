const Joi = require("joi");

const createValidation = Joi.object({
  email: Joi.string().trim().email().required(),
  username: Joi.string().trim().required().min(3).max(40),
  password: Joi.string().min(6).required(),
  name: Joi.string().required().min(3).max(50),
  role: Joi.string(),
});

module.exports = {
  createValidation,
};
