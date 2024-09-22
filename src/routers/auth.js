import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/authValidation.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUser),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUser));

export default router;
