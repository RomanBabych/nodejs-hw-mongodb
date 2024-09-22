import mongoose from 'mongoose';

export const initMongoDB = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
      process.env;

    const DB_HOST = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(DB_HOST);
    console.log('Mongodb connection successfully');
  } catch (error) {
    console.log('Mongodb connection error', error.message);
    throw error;
  }
};
