import {
  getContacts as getContactsService,
  getContactById as getContactByIdService,
} from '../services/contacts.js';

export const getContacts = async (req, res) => {
  try {
    const result = await getContactsService();
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error retrieving contacts',
      error: error.message,
    });
  }
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  try {
    const result = await getContactByIdService(contactId);
    if (result) {
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: result,
      });
    } else {
      res.status(404).json({
        message: 'Contact not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error retrieving contact',
      error: error.message,
    });
  }
};
