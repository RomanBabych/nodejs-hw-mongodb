import Joi from 'joi';
import { emailRegexp } from '../constants/users.js';


export const userSignupSchema = Joi.object({
  name: Joi.string().required().min(3).max(20).messages({
    'string.base': 'Name should be a type of string',
    'string.min': 'Name should have a minimum length of 3',
    'string.max': 'Name should have a maximum length of 20',
    'any.required': "Name is required field"
  }),
  email: Joi.string().pattern(emailRegexp).min(3).messages({
    'string.base': 'email should be a type of string',
    'string.empty': 'email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'string.min': 'email should have a minimum length of 3',
    'string.max': 'email should have a maximum length of 20',
  }),
  password: Joi.string().required().min(3).max(20).messages({
    'string.base': 'password should be a type of string',
    'string.empty': 'password cannot be empty',
    'string.min': 'password should have a minimum length of 3',
    'string.max': 'password should have a maximum length of 20',
    'any.required': 'password is a required field',
  })
});
export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).min(3).messages({
    'string.base': 'email should be a type of string',
    'string.empty': 'email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'string.min': 'email should have a minimum length of 3',
    'string.max': 'email should have a maximum length of 20',
  }),
  password: Joi.string().required().min(3).messages({
    'string.base': 'password should be a type of string',
    'string.empty': 'password cannot be empty',
    'string.min': 'password should have a minimum length of 3',
    'string.max': 'password should have a maximum length of 20',
    'any.required': 'password is a required field',
  })
});
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).min(3).required().messages({
    'string.base': 'email should be a type of string',
    'string.empty': 'email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'string.min': 'email should have a minimum length of 3',
    'string.max': 'email should have a maximum length of 20',
  }),
});
export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(3).max(20).required(),
  token: Joi.string().required(),
});
export const googleSingInOrSingupSchema = Joi.object({
  code: Joi.string().required(),
});
