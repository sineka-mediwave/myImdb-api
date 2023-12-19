const Joi = require("joi");

const ratingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
});

module.exports = {
  ratingSchema,
};
