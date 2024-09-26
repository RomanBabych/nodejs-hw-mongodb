import express from 'express';
import cors from 'cors';
import pino from 'pino';
import expressPino from 'express-pino-logger';
import contactsRouter from './routers/contacts.js'; // Импорт маршрутов для контактов
import authRouter from './routers/auth.js'; // Импорт маршрутов для аутентификации
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

export function setupServer() {
  const app = express();
  const logger = pino();
  const expressLogger = expressPino({ logger });

  app.use(cors());
  app.use(expressLogger);
  app.use(cookieParser());
  app.use(express.json());

  // Маршруты для работы с контактами и аутентификацией без префикса /api
  app.use('/contacts', contactsRouter); // Маршруты для контактов
  app.use('/auth', authRouter); // Маршруты для аутентификации

  app.use(notFoundHandler); // Обработчик для 404
  app.use(errorHandler); // Центральный обработчик ошибок

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
