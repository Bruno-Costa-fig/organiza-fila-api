import User from "../model/User";
import IUser from "../types/IUser";
import { getUserInfo } from "./auth";
import { getAll, getById, create, update, remove, getWhere } from "./baseCrud";

const getAllUsers = async () => {
  let data = [] as IUser[];
  let error = null;
  try{
    const users = await getAll(User);
    data = users.map((user: any) => user.toJSON()) as IUser[];
  } catch (error) {
    console.error('Error getting all users:', error);
    error = error;
  }

  return {
    data,
    error
  }
}

const getUserById = async (id: string | number) => {
  let data = {} as IUser;
  let error = null;
  try{
    // @ts-ignore
    data = await getById(User, id);
  } catch (error) {
    console.error('Error getting user:', error);
    error = error;
  }

  return {
    data,
    error
  }
}

const insertUser = async (user: IUser) => {
  let data = {} as IUser;
  let error = null;

  try{
    let hasSame = await getWhere(User, 'email', user.email);
    if(!!hasSame){
      error = 'Já existe um usuário com esse email!';
      return {
        data,
        error
      }
    }
    // @ts-ignore
    data = await create(User, user);
  } catch (error) {
    console.error('Error create user:', error);
    error = error;
  }

  return {
    data,
    error
  }
}

const updateUser = async (user: IUser) => {
  let data = {} as IUser;
  let error = null;
  try{
    // @ts-ignore
    data = await update(User, user.id, user);
  } catch (error) {
    console.error('Error update user:', error);
    error = error;
  }

  return {
    data,
    error
  }
}

const deleteUser = async (user: IUser) => {
  let data = {} as IUser;
  let error = null;
  try{
    // @ts-ignore
    data = await remove(User, user.id, user);
  } catch (error) {
    console.error('Error remove user:', error);
    error = error;
  }

  return {
    data,
    error
  }
}

// User.sync({force: true})
//   .then(() => console.log('User table created successfully'))
//   .catch(error => console.error('Error creating User table:', error));

  export {
    getAllUsers,
    getUserById,
    insertUser,
    updateUser,
    deleteUser
  }