import User from "../model/User";
import { IOrganization, UserGet } from "../types";
import IUser from "../types/IUser";
import Organization from "../model/Organization";
// @ts-ignore
import bcrypt from "bcrypt";
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

const canAddUser = async (role: string, organizationId: number) => {
  let data = false;
  let error = null;
  try {
    // @ts-ignore
    const organization: IOrganization = await getById(
      Organization,
      organizationId
    );
    const users = await getAll(User);
    let allUsers = users.map((user: any) => user.toJSON()) as IUser[];
    let count = 0;
    allUsers.map((x) => {
      if (x.role.includes(role)) {
        count++;
      }
    });

    switch (role) {
      case "balcao":
        if (count < organization.limiteBalcoes) {
          data = true;
        }
        break;
      case "painel":
          if (count < organization.limitePaineis) {
            data = true;
          }
          break;
      default: 
        data = true;
        break;
    }
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

function sync() {
  User.sync({ force: true })
    .then(async () => {
      console.log("User table created successfully");
      const hashedPassword = await bcrypt.hash(
        process.env.SENHA_ADMIN,
        process.env.SALT
      );

      User.create({
        username: "Admin Iguatec",
        password: hashedPassword,
        valid: true,
        email: process.env.EMAIL_ADMIN,
        uid: uuidv4(),
        organizationId: 1,
        createdAt: new Date(),
        numero: "",
        id: 1,
        role: "sysadmin",
      });
    })
    .catch((error) => console.error("Error creating User table:", error));
}

// sync();

export { getAllUsers, canAddUser, getUserById, insertUser, updateUser, deleteUser };
