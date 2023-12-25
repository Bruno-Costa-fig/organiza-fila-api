import { NewUserDTO, ParametrosGetFirts, User, UserLoginDTO, TokenUser } from "../types"
import { base_get_first, base_insert } from "./firebase-functions";
// @ts-ignore
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import e from "express";
dotenv.config()

async function CreateUser(userDto: NewUserDTO) {
  let result: string | null = null;
  let error: string | null = null;
  if (!userDto) {
    return null;
  }

  
  try {
    let salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(userDto.password, process.env.SALT);
  
    let user: User = {
      createdAt: new Date(),
      email: userDto.email,
      organizationId: userDto.organizationId,
      password: hashedPassword,
      token: "",
      username: userDto.username,
      valid: true,
      uid: "",
      balcao: userDto.balcao
    }
    const parametros: ParametrosGetFirts = {
      key: "email",
      value: userDto.email,
      comparador: "=="
    }

    const hasSame = await base_get_first<User>("users", parametros);

    if (!!hasSame.dados) {
      throw new Error("Já existe um usuário com esse email!");
    }

    const res = await base_insert<User>("users", user);
    result = res;
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
       
    const parametros: ParametrosGetFirts = {
      key: "email",
      value: userDto.email,
      comparador: "=="
    }
    
    const res = await base_get_first<User>("users", parametros);

    if(!!res.error){
      throw new Error(res.error);
    }

    const user = res.dados;

    if (!user) {
      throw new Error("Usuário não encontrado!");
    }

    const valid = await bcrypt.compare(userDto.password, user.password);

    if (!valid) {
      throw new Error("Senha incorreta!");
    }

    const tokenUser: TokenUser = {
      email: user.email,
      username: user.username,
      organizationId: user.organizationId,
      balcao: user.balcao,
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