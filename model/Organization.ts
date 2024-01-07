import { DataTypes } from "sequelize";
import { sequelize as db } from "../db";

const Organization = db.define('Organization', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: DataTypes.STRING,
  cnpj: DataTypes.STRING,
  adminEmail: DataTypes.STRING,
  logoUrl: DataTypes.STRING,
  secondLogoUrl: DataTypes.STRING,
  thirdLogoUrl: DataTypes.STRING,
  primaryColor: DataTypes.STRING,
  secondaryColor: DataTypes.STRING,
  limiteBalcoes: DataTypes.INTEGER,
  limitePaineis: DataTypes.INTEGER,
  limiteUsuarios: DataTypes.INTEGER,
  valid: DataTypes.BOOLEAN,
  uid: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  processType: DataTypes.STRING,
  hasManualCode: DataTypes.BOOLEAN,
});

export default Organization;