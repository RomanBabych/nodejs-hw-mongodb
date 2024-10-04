import jwt from "jsonwebtoken";
import { env } from "./env.js";

const jwt_secret= env('JWT_SECRET');


export const createJwtToken = (payload) => jwt.sign(payload , jwt_secret , {expiresIn: '15m'});


export const  verifyJwtToken = token => {
  try {
    const payload = jwt.verify(token , jwt_secret);
    return {data: payload};
  } catch (error) {
    return {error};
  }
};
