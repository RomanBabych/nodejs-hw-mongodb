import nodemailer from 'nodemailer';
import { env } from './env.js';

const transporter = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: env('SMTP_PORT'),
  secure: false,
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = async (options) => {
  try {
    const info = await transporter.sendMail({
      from: env('SMTP_FROM'),
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send the email.');
  }
};

export default transporter;
