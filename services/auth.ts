import {
  UserLoginDTO,
  TokenUser,
} from "../types";
import IUser from "../types/IUser";
import User from "../model/User";
// @ts-ignore
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { getWhere } from "./baseCrud";

async function LoginUser(userDto: UserLoginDTO) {
  let result: string | null = null;
  let error: string | null = null;
  if (!userDto) {
    return null;
  }

  try {
    // @ts-ignore
    const user: IUser = await getWhere(User, "email", userDto.email);

    if (user == null) {
      throw new Error("Usuário não encontrado!");
    }

    const valid = await bcrypt.compare(userDto.password, user.password);

    if (!valid) {
      error = "Senha incorreta!";
    } else {
      const tokenUser: TokenUser = {
        username: user.username,
        organizationId: user.organizationId,
        numero: user.numero,
        role: user.role
      };

      // @ts-ignore
      const token = jwt.sign({ tokenUser }, process.env.SECRET, {
        expiresIn: "1d", // expires in 1 dia
      });

      result = JSON.stringify({ token, user: tokenUser });
    }
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

export { LoginUser, getUserInfo };
