import express from 'express';
import cors from 'cors';
import pino from 'pino';
import expressPino from 'express-pino-logger';
import {
  getContacts,
  getContactById,
} from './controllers/contactController.js';

export function setupServer() {
  const app = express();

  const logger = pino();
  const expressLogger = expressPino({ logger });

  app.use(cors());
  app.use(expressLogger);
  app.use(express.json());

  app.get('/contacts', getContacts);
  app.get('/contacts/:contactId', getContactById);

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
