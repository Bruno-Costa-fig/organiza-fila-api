import BalcaoLogs from "../model/BalcaoLogs";
import IBalcaoLogs from "../types/IBalcaoLogs";
// @ts-ignore
import dotenv from "dotenv";
dotenv.config();
import { getAll, getById, create, update, remove, getWhere, getLast } from "./baseCrud";

const getAllBalcaoLogs = async (organizationId: number) => {
  let data = [] as IBalcaoLogs[];
  let error = null;
  try {
    const balcaoLogs = await getAll(BalcaoLogs);
    data = balcaoLogs.map((balcaoLog: any) => balcaoLog.toJSON()) as IBalcaoLogs[];
  } catch (error) {
    console.error("Error getting all balcaoLogs:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

const getBalcaoLogsById = async (organizationId: number, id: string | number) => {
  let data = {} as IBalcaoLogs;
  let error = null;
  try {
    const balcaoLog = await getById(BalcaoLogs, id);
    // @ts-ignore
    data = balcaoLog.toJSON() as IBalcaoLogs;
  } catch (error) {
    console.error("Error getting balcaoLog by id:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

const getBalcaoLogsByIdLast = async (organizationId: number, id: string | number) => {
  let data = {} as IBalcaoLogs;
  let error = null;
  try {
    const balcaoLog = await getLast(BalcaoLogs, 'balcaoId', id);
    // @ts-ignore
    data = balcaoLog.toJSON() as IBalcaoLogs;
  } catch (error) {
    console.error("Error getting balcaoLog by id:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

const inserBalcaoLogs = async (organizationId: number, balcaoLog: IBalcaoLogs) => {
  let data = {} as IBalcaoLogs;
  let error = null;
  try {
    const newBalcaoLog = await create(BalcaoLogs, balcaoLog);
    // @ts-ignore
    data = newBalcaoLog.toJSON() as IBalcaoLogs;
  } catch (error) {
    console.error("Error creating balcaoLog:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

const updateBalcaoLogs = async (organizationId: number, id: string | number, balcaoLog: IBalcaoLogs) => {
  let data = {} as IBalcaoLogs;
  let error = null;
  try {
    const updatedBalcaoLog = await update(BalcaoLogs, id, balcaoLog);
    // @ts-ignore
    data = updatedBalcaoLog.toJSON() as IBalcaoLogs;
  } catch (error) {
    console.error("Error updating balcaoLog:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

const deleteBalcaoLogs = async (organizationId: number, id: string | number) => {
  let data = {} as IBalcaoLogs;
  let error = null;
  try {
    const deletedBalcaoLog = await remove(BalcaoLogs, id);
    // @ts-ignore
    data = deletedBalcaoLog.toJSON() as IBalcaoLogs;
  } catch (error) {
    console.error("Error deleting balcaoLog:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

// BalcaoLogs.sync({ force: false }).then(() => console.log("BalcaoLogs table created"));

export {
  getAllBalcaoLogs,
  getBalcaoLogsById,
  getBalcaoLogsByIdLast,
  inserBalcaoLogs,
  updateBalcaoLogs,
  deleteBalcaoLogs,
}