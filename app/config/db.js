import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/*const sequelize = new Sequelize('useradmin', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});*/

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions:{
    connectTimeout: 60000
  }
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