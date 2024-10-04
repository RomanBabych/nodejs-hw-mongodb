import {isValidObjectId} from 'mongoose';

import createHttpError from "http-errors";


export default function isValidId(req , res , next) {
  const {contactId} = req.params;
  if(!isValidObjectId(contactId)) {
    return next(createHttpError(404 , `${contactId} is mot valid id`));
  }
  next();
}
