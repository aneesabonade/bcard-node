const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  isBusiness: Joi.boolean().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
}).min(1);

module.exports = { registerSchema, loginSchema, updateUserSchema };