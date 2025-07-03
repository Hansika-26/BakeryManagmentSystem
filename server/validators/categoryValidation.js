import Joi from 'joi';

export const addCategoryValidator = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.empty': 'Category name is required',
      'string.min': 'Category name must be at least 3 characters',
      'any.required': 'Category name is required',
    }),

});


export const updateCategoryValidator = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.empty': 'Category name is required',
      'string.min': 'Category name must be at least 3 characters',
      'any.required': 'Category name is required',
    }),
});
