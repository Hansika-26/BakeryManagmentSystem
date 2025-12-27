import Joi from 'joi';

export const addProductValidator = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 3 characters',
      'any.required': 'Product name is required',
    }),

  description: Joi.string()
    .min(10)
    .required()
    .messages({
      'string.empty': 'Product description is required',
      'string.min': 'Description must be at least 10 characters',
      'any.required': 'Product description is required',
    }),

  price: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be greater than 0',
      'any.required': 'Price is required',
    }),

  image: Joi.string()

    .required()
    .messages({

      'any.required': 'Image URL is required',
    }),

  category: Joi.string()
    .required()
    .messages({
      'string.empty': 'Category is required',
      'any.required': 'Category is required',
    }),
});


export const updateProductValidator = Joi.object({
  name: Joi.string().min(3).optional().messages({
    'string.min': 'Product name must be at least 3 characters',
  }),

  description: Joi.string().min(10).optional().messages({
    'string.min': 'Description must be at least 10 characters',
  }),

  price: Joi.number().positive().optional().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be greater than 0',
  }),


  image: Joi.string().required().messages({
    'any.required': 'Image is required'
  }),



  category: Joi.string().optional().messages({
    'string.empty': 'Category cannot be empty',
  }),
});
