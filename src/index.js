import dotenv from 'dotenv';
dotenv.config();

import { setupServer } from './server.js';
import { initMongoDB } from './db/initMongoConnection.js';

const startApp = async () => {
  await initMongoDB();
  setupServer();
};

startApp();
