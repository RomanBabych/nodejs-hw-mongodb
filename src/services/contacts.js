import Contact from '../models/contactModel.js';

export const getContacts = async () => {
  try {
    const contacts = await Contact.find();
    return {
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    };
  } catch (error) {
    throw new Error('Error retrieving contacts: ' + error.message);
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    if (contact) {
      return contact;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Error retrieving contact: ' + error.message);
  }
};
