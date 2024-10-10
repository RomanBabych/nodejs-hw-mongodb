import { env } from './env.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: Number(env('SMTP_PORT')),
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = async (data) => {
  const email = { ...data, from: env('SMTP_FROM') };
  return await transporter.sendMail(email);
};

export default sendMail;
