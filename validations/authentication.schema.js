const Joi = require("joi");

const signUpSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  user_name: Joi.string()
    .min(5)
    .pattern(new RegExp("^[a-zA-Z0-9^_-]"))
    .required(),
  user_password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*_=+-]{8,20}$"))
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  user_password: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .optional(),
  user_name: Joi.string()
    .min(5)
    .pattern(new RegExp("^[a-zA-Z0-9^_-]"))
    .optional(),
  user_password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*_=+-]{8,20}$"))
    .optional(),
});

module.exports = {
  signUpSchema,
  updateUserSchema,
  loginSchema,
};
