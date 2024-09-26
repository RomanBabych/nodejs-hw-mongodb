import express from 'express';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contactController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import {
  contactSchema,
  contactUpdateSchema,
} from '../validation/contactValidation.js';
import isValidId from '../middlewares/isValidId.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));
router.post(
  '/',
  authMiddleware,
  validateBody(contactSchema),
  ctrlWrapper(createContact),
);
router.patch(
  '/:contactId',
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(updateContact),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
