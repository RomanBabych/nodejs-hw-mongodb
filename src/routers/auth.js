import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/authController.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/authValidation.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUser),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUser));

router.post('/logout', authMiddleware, ctrlWrapper(logoutUser));

export default router;
