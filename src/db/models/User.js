import { Schema, model } from "mongoose";
import { emailRegexp } from "../../constants/users.js";


const userShema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: emailRegexp,
  },
  password: {
    type: String,
    required: true,
  },
  verify: {
    type: Boolean,
    default: false,
    required: true,
  }
}, {versionKey: false, timestamps: true});


const UserCollection = model('user' , userShema);

export default UserCollection;
