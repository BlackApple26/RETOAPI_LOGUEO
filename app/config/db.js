import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize('useradmin', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
  } catch (err) {
    console.error('Error connecting to database', err);
  }
};

export { sequelize, connectDB };