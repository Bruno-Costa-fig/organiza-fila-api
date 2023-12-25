import { NewUserDTO, ParametrosGetFirts, UserLoginDTO, TokenUser } from "../types"
import IUser from "../types/IUser";
import User from "../model/User";
// @ts-ignore
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { getWhere } from "./baseCrud";
dotenv.config()
import {v4 as uuidv4} from 'uuid';
import { insertUser } from "./userService";

async function CreateUser(userDto: NewUserDTO) {
  let result: string | null = null;
  let error: string | null = null;
  if (!userDto) {
    return null;
  }

  try {
    const hashedPassword = await bcrypt.hash(userDto.password, process.env.SALT);
  
    let user: IUser = {
      createdAt: new Date(),
      email: userDto.email,
      organizationId: userDto.organizationId,
      password: hashedPassword,
      username: userDto.username,
      valid: true,
      uid: uuidv4(),
      numero: userDto.numero,
      role: userDto.role,
      id: 0,
    }

    const hasSame = await getWhere(User, 'email', userDto.email);

    if (!!hasSame) {
      throw new Error("Já existe um usuário com esse email!");
    }

    const res = await insertUser(user);
    result = JSON.stringify(res);
  }
  catch(error) {
    // @ts-ignore
    error = error.message;
  }

  return { result, error };
}

async function LoginUser(userDto: UserLoginDTO) {
  let result: string | null = null;
  let error: string | null = null;
  if (!userDto) {
    return null;
  }

  try {
    // @ts-ignore
    const user: IUser = await getWhere(User, 'email', userDto.email);

    if(user == null){
      throw new Error('Usuário não encontrado!');
    }

    const valid = await bcrypt.compare(userDto.password, user.password);

    if (!valid) {
      throw new Error("Senha incorreta!");
    }

    const tokenUser: TokenUser = {
      email: user.email,
      username: user.username,
      organizationId: user.organizationId,
      numero: user.numero,
    }
    
    // @ts-ignore
    const token = jwt.sign({ tokenUser }, process.env.SECRET, {
      expiresIn: "1d" // expires in 1 dia
    });

    result = JSON.stringify({token, user: tokenUser});
  } catch (error) {
    // @ts-ignore
   error = error.message; 
  }


  return { result, error };
}

function getUserInfo(token: string) {
  let result: string | null = null;
  let error: string | null = null;
  if (!token) {
    return null;
  }

  try {
    // @ts-ignore
    const decoded = jwt.verify(token, process.env.SECRET);
    result = JSON.stringify(decoded);
  } catch (error) {
    // @ts-ignore
    error = error.message;
  }

  return { result, error };
}

export { CreateUser, LoginUser, getUserInfo };