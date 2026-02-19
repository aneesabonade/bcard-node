const Joi = require("joi");

const cardSchema = Joi.object({
  title: Joi.string().min(2).required(),
  subtitle: Joi.string().min(2).required(),
  description: Joi.string().min(2).required(),
  phone: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  web: Joi.string().allow("").optional(),
  imageUrl: Joi.string().allow("").optional(),
  address: Joi.object({
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.number().required(),
    zip: Joi.number().optional(),
  }).required(),
});

module.exports = { cardSchema };