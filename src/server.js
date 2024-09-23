import express from 'express';
import cors from 'cors';
import pino from 'pino';
import expressPino from 'express-pino-logger';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

export function setupServer() {
  const app = express();
  const logger = pino();
  const expressLogger = expressPino({ logger });

  app.use(cors());
  app.use(expressLogger);
  app.use(express.json());

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
