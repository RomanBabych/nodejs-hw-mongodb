import { Schema, model } from "mongoose";
import { enumContactType } from "../../constants/contacts.js";

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: null,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    enum: enumContactType,
    required: true,
    default: 'personal',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  photo: {
    type: String,
  }
}, { timestamps: true  , versionKey: false});

const ContactCollection = model('Contact', contactSchema);

export const sortFields = ["name" , "phoneNumber" , "email" , "isFavourite" , "contactType"];


export default ContactCollection;
