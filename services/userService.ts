import User from "../model/User";
import { UserGet } from "../types";
import IUser from "../types/IUser";
import { getUserInfo } from "./auth";
// @ts-ignore
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid";
import { getAll, getById, create, update, remove, getWhere } from "./baseCrud";

const getAllUsers = async (role: string = "") => {
  let data = [] as UserGet[];
  let error = null;
  try {
    const users = await getAll(User);
    let allUsers = users.map((user: any) => user.toJSON()) as IUser[];
    allUsers.map((x) => {
      if (!!role) {
        if (x.role.includes(role)) {
          data.push({
            email: x.email,
            username: x.username,
            organizationId: x.organizationId,
            numero: x.numero,
            role: x.role,
          });
        }
      } else {
        data.push({
          email: x.email,
          username: x.username,
          organizationId: x.organizationId,
          numero: x.numero,
          role: x.role,
        });
      }
    });
  } catch (error) {
    console.error("Error getting all users:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

const getUserById = async (id: string | number) => {
  let data = {} as IUser;
  let error = null;
  try {
    // @ts-ignore
    data = await getById(User, id);
  } catch (error) {
    console.error("Error getting user:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

const insertUser = async (user: IUser) => {
  let data = {} as UserGet;
  let error = null;

  if (!user) {
    return null;
  }

  try {
    let hasSame = await getWhere(User, "email", user.email);
    if (!!hasSame) {
      error = "Já existe um usuário com esse email!";
      return {
        data,
        error,
      };
    }

    const hashedPassword = await bcrypt.hash(user.password, process.env.SALT);

    user.uid = uuidv4();
    user.password = hashedPassword;

    // @ts-ignore
    let dados: IUser = await create(User, user);
    data = {
      email: dados.email,
      numero: dados.numero,
      organizationId: dados.organizationId,
      role: dados.role,
      username: dados.username,
    };
  } catch (error) {
    console.error("Error create user:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

const updateUser = async (user: IUser) => {
  let data = {} as IUser;
  let error = null;
  try {
    // @ts-ignore
    data = await update(User, user.id, user);
  } catch (error) {
    console.error("Error update user:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

const deleteUser = async (user: IUser) => {
  let data = {} as IUser;
  let error = null;
  try {
    // @ts-ignore
    data = await remove(User, user.id, user);
  } catch (error) {
    console.error("Error remove user:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

// User.sync({force: true})
//   .then(() => console.log('User table created successfully'))
//   .catch(error => console.error('Error creating User table:', error));

export { getAllUsers, getUserById, insertUser, updateUser, deleteUser };
