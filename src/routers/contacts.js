import {Router} from 'express';

import * as contactsControler from '../controller/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import { contactsAddSchema, contactsPatchSchema } from '../validation/contacts.js';
import isValidId from '../midllewares/isValidId.js';
import authenticate from '../midllewares/authenticate.js';
import upload from '../midllewares/multer.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(contactsControler.getAllContactsControler));

contactsRouter.get('/:contactId', isValidId ,  ctrlWrapper(contactsControler.getContactByIdControler));

contactsRouter.post('/' ,upload.single('photo'),validateBody(contactsAddSchema), ctrlWrapper(contactsControler.addContactControler));

contactsRouter.patch("/:contactId",upload.single('photo'), isValidId , validateBody(contactsPatchSchema), ctrlWrapper(contactsControler.patchContactControler));

contactsRouter.put("/:contactId" ,isValidId , validateBody(contactsAddSchema), ctrlWrapper(contactsControler.upsertContactControler));

contactsRouter.delete("/:contactId" ,isValidId, ctrlWrapper(contactsControler.deleteContactControler));

export default contactsRouter;
