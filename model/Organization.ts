import { DataTypes } from "sequelize";
import { sequelize as db } from "../db";

const Organization = db.define('Organization', {
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

export default Organization;