import createError from 'http-errors';
import {
  getContacts as getAllContacts,
  getContactById as fetchContactById,
  createContact as createNewContact,
  updateContact as updateExistingContact,
  deleteContact as removeContact,
} from '../services/contacts.js';

export const getContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;

    const result = await getAllContacts({
      page: Number(page),
      perPage: Number(perPage),
      sortBy,
      sortOrder,
      type,
      isFavourite,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: result,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await fetchContactById(contactId);

    if (!contact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await createNewContact(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully created contact!',
      data: newContact,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await updateExistingContact(contactId, req.body);

    if (!updatedContact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);

    if (!result) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(204).json();
  } catch (error) {
    next(createError(500, error.message));
  }
};
