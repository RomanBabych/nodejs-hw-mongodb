import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  requestResetEmailSchema,
  resetPasswordSchema,
  userSigninSchema,
  userSignupSchema,
} from '../validation/users.js';
import * as authController from '../controller/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userSignupSchema),
  ctrlWrapper(authController.signupController),
);
authRouter.post(
  '/login',
  validateBody(userSigninSchema),
  ctrlWrapper(authController.singinController),
);
authRouter.post('/refresh', ctrlWrapper(authController.refreshController));
authRouter.post('/logout', ctrlWrapper(authController.logoutController));
authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(authController.requestResetEmailController),
);
authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authController.resesPasswordController),
);
export default authRouter;
