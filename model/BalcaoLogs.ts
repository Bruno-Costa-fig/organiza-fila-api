import { DataTypes } from "sequelize";
import { sequelize as db } from "../db";

const BalcaoLogs = db.define('BalcaoLogs', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    autoIncrementIdentity: true,
  },
  balcaoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  atendimentoId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prioridade: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

export default BalcaoLogs;