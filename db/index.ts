import { Sequelize, DataTypes } from 'sequelize';
import { Organization } from '../types';

const sequelize = new Sequelize('filaja', 'developer', 'admin', {
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

// testConnection();

const Organization = sequelize.define('Organization', {
  name: DataTypes.STRING,
  cnpj: DataTypes.STRING,
  adminEmail: DataTypes.STRING,
  logoUrl: DataTypes.STRING,
  secondLogoUrl: DataTypes.STRING,
  thirdLogoUrl: DataTypes.STRING,
  primaryColor: DataTypes.STRING,
  secondaryColor: DataTypes.STRING,
  limiteBalcoes: DataTypes.INTEGER,
  valid: DataTypes.BOOLEAN,
  uid: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  valid: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  uid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  organizationId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Organization.sync()
//   .then(() => console.log('Organization table created successfully'))
//   .catch(error => console.error('Error creating Organization table:', error));

User.sync()
  .then(() => console.log('User table created successfully'))
  .catch(error => console.error('Error creating User table:', error));

// async function createOrganization(model: Organization) {
//   const result = 
//   try {
//     const newOrganization = await Organization.create(model);
//     console.log('Organization created successfully:', newOrganization.toJSON());
//   } catch (error) {
//     console.error('Error creating organization:', error);
//   }
// }

// createOrganization();

// async function createOrganization() {
//   try {
//     const newOrganization = await Organization.create({
//       name: 'My Organization',
//       cnpj: '12345678901234',
//       adminEmail: 'admin@myorg.com',
//       logoUrl: 'http://example.com/logo1.png',
//       secondLogoUrl: 'http://example.com/logo2.png',
//       thirdLogoUrl: 'http://example.com/logo3.png',
//       primaryColor: '#123456',
//       secondaryColor: '#654321',
//       limiteBalcoes: 10,
//       valid: true,
//       uid: 'unique-id',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//     console.log('Organization created successfully:', newOrganization.toJSON());
//   } catch (error) {
//     console.error('Error creating organization:', error);
//   }
// }

// createOrganization();