import createError from 'http-errors';
import Contact from '../models/contactModel.js';

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

    const filter = { userId: req.user._id };

    if (type) {
      filter.contactType = type;
    }

    if (typeof isFavourite !== 'undefined') {
      filter.isFavourite = isFavourite;
    }

    const result = await Contact.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

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
    if (!req.user || !req.user._id) {
      return next(createError(401, 'Unauthorized: User not authenticated'));
    }

    const { contactId } = req.params;

    const contact = await Contact.findOne({
      _id: contactId,
      userId: req.user._id,
    });

    if (!contact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Contact found successfully!',
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    next(createError(500, error.message));
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = new Contact({ ...req.body, userId: req.user._id });
    await contact.save();
    res.status(201).json({
      status: 201,
      message: 'Contact created successfully!',
      data: contact,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId: req.user._id },
      req.body,
      { new: true },
    );

    if (!updatedContact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully!',
      data: updatedContact,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await Contact.findOneAndDelete({
      _id: contactId,
      userId: req.user._id,
    });

    if (!deletedContact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Contact deleted successfully!',
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};
