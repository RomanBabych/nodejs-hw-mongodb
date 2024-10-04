import createHttpError from 'http-errors';
import * as contactsServices from '../secvices/contacts.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import { sortFields } from '../db/models/Contacts.js';
import parseContactsFilter from '../utils/filter/parseContactsFilter.js';
import saveFileToUploadDir from '../utils/saveFileToUploadDir.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

const enableCloudinary = env('ENABLE_CLOUDINARY');

export const getAllContactsControler = async (req, res) => {
  const {_id: userId} = await req.user;
  const {page , perPage} = parsePaginationParams(req.query);
  const {sortBy , sortOrder} = parseSortParams({...req.query , sortFields});
  const filter = parseContactsFilter(req.query);

  const data = await contactsServices.getContacts({page , perPage , sortOrder , sortBy , filter: {...filter , userId}});

  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data,
  });
};
export const getContactByIdControler = async (req, res) => {
  const {contactId} = req.params;
  const {_id: userId} = await req.user;
  const data = await contactsServices.getAllContact({_id: contactId , userId});
  if(!data) {
    throw createHttpError(404 , "Contact not found");
  }
  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data,
  });
};
export const addContactControler = async (req , res) => {
  let fileName;
  if(req.file) {
    if(enableCloudinary == 'true') {
      fileName = await saveFileToCloudinary(req.file, 'photo');
    }else {
      fileName = saveFileToUploadDir(req.file);
    }
  }
  const {_id: userId} = await req.user;

  const data = await contactsServices.addContact({...req.body , userId , photo: fileName});

  res.status(201).json({
    status: 201,
		message: "Successfully created a contact!",
		data
  });
};

export const patchContactControler = async (req , res) => {
  let fileName;
  if(req.file) {
    if(enableCloudinary == 'true') {
      fileName = await saveFileToCloudinary(req.file, 'photo');
    }else {
      fileName = saveFileToUploadDir(req.file);
    }
  };
  const {contactId} = req.params;
  const {_id: userId} = await req.user;
  const result = await contactsServices.updateContact({"_id": contactId , userId} , {...req.body , photo:fileName});

  if (!result) {
    throw createHttpError(404, `Contact not found`);
  };
  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result.data
  });
};
export const upsertContactControler =  async (req , res) => {
  const {contactId} = req.params;
  const {_id: userId} = await req.user;
  const {data , isNew} = await contactsServices.updateContact({"_id": contactId , userId} , req.body , {upsert: true});

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: "Contact upsert successfully",
    data,
  });
};
export const deleteContactControler  = async (req, res) => {
  const {contactId} = req.params;
  const {_id: userId} = await req.user;
  const data = await contactsServices.deleteContact({"_id": contactId , userId});

  if(!data) {
    throw createHttpError(404 , 'Contact not found');
  }

  res.status(204).send();
};
