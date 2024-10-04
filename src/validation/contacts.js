import Joi from 'joi';
import { enumContactType } from '../constants/contacts.js';

export const contactsAddSchema = Joi.object({
  name: Joi.string().required().min(3).max(20).messages({
    'string.base': 'Name should be a type of string',
    'string.min': 'Name should have a minimum length of 3',
    'string.max': 'Name should have a maximum length of 20',
    'any.required': "Name is required field"
  }),
  phoneNumber: Joi.string().required().min(3).max(20).messages({
    'string.base': 'Phone number should be a type of string',
    'string.empty': 'Phone number cannot be empty',
    'string.min': 'Phone number should have a minimum length of 3',
    'string.max': 'Phone number should have a maximum length of 20',
    'any.required': 'Phone number is a required field'
  }),
  email: Joi.string().email().min(3).max(20).messages({
    'string.base': 'email should be a type of string',
    'string.empty': 'email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'string.min': 'email should have a minimum length of 3',
    'string.max': 'email should have a maximum length of 20',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite should be a boolean'
  }),
  contactType: Joi.string().required().valid(...enumContactType).min(3).max(20).messages({
    'string.base': 'Contact type should be a type of string',
    'string.empty': 'Contact type cannot be empty',
    'string.min': 'Contact type should have a minimum length of 3',
    'string.max': 'Contact type should have a maximum length of 20',
    'any.required': 'Contact type is a required field',
    'any.only': 'Contact type must be one of personal , home , work'}),
});

export const contactsPatchSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a type of string',
    'string.min': 'Name should have a minimum length of 3',
    'string.max': 'Name should have a maximum length of 20',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'Phone number should be a type of string',
    'string.empty': 'Phone number cannot be empty',
    'string.min': 'Phone number should have a minimum length of 3',
    'string.max': 'Phone number should have a maximum length of 20',
  }),
  email: Joi.string().email().min(3).max(20).messages({
    'string.base': 'email should be a type of string',
    'string.empty': 'email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'string.min': 'email should have a minimum length of 3',
    'string.max': 'email should have a maximum length of 20',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite should be a boolean'
  }),
  contactType: Joi.string().valid(...enumContactType).min(3).max(20).messages({
    'string.base': 'Contact type should be a type of string',
    'string.empty': 'Contact type cannot be empty',
    'string.min': 'Contact type should have a minimum length of 3',
    'string.max': 'Contact type should have a maximum length of 20',
    'any.only': 'Contact type must be one of personal , home , work'}),
});
