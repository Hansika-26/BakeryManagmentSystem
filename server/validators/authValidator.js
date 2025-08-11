// validators/authValidator.js
import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required',
    }),

  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),

});


export const loginValidator = Joi.object({

    email: Joi.string()
      .email({ tlds: { allow: false } }) // general email validation
      .pattern(/@gmail\.com$/)           // must be a Gmail address
      .required()
      .messages({
        'string.email': 'Invalid email format',
        'string.pattern.base': 'Email must be a valid Gmail address',
        'any.required': 'Email is required',
      }),

    password: Joi.string()
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain letters, numbers, and special characters',
        'any.required': 'Password is required',
      }),

})


export const updateUserProfileValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 50 characters',
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Email must be a valid format',
    }),

  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/)
    .messages({
      'string.pattern.base':
        'Password must include letters, numbers, and special characters',
    }),
});
