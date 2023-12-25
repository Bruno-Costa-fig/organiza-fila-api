import { Sequelize } from 'sequelize';
import dotenv from "dotenv";
dotenv.config()

export const sequelize = new Sequelize(
  process.env.POSTGRES_DATABASE ?? "", 
  process.env.POSTGRES_USER ?? "", 
  process.env.POSTGRES_PASSWORD, 
  {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();




// Organization.sync()
//   .then(() => console.log('Organization table created successfully'))
//   .catch(error => console.error('Error creating Organization table:', error));