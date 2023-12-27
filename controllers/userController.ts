import { getUserInfo } from "../services/auth";
import { deleteUser, getUserById, getAllUsers, insertUser, updateUser, canAddUser } from "../services/userService";
import IUser from "../types/IUser";
import { Request, Response } from "express";

const get = (req: Request, res: Response) => {
  let role = req.query.role
  // @ts-ignore
  getAllUsers(role).then((result) => {
    res.status(200).json(result);
  }).catch((error) => {
    res.status(400).json(error);
  });
};

const getById = (req: Request, res: Response) => {
  getUserById(req.params.id).then((result) => {
    res.status(200).json(result);
  }).catch((error) => {
    res.status(400).json(error);
  });
};

const post = async (req: Request, res: Response) => {
  let token = req.headers.authorization;

  // @ts-ignore
  let info = getUserInfo(token);
  let userLogado = JSON.parse(info?.result || "{}");

  let user = req.body as IUser;
  user.valid = true;
  user.organizationId != 0 ? user.organizationId : userLogado?.organizationId ?? 0;

  let candd = await canAddUser(user.role, user.organizationId);

  if(!candd.data){
    res.status(400).json('O limite de usuários foi atingido!');
    return;
  }

  insertUser(user).then((result) => {
    res.status(200).json(result);
  }).catch((error) => {
    res.status(400).json(error);
  });
};

const put = (req: Request, res: Response) => {
  updateUser(req.body as IUser).then((result) => {
    res.status(200).json(result);
  }).catch((error) => {
    res.status(400).json(error);
  });
};

const remove = async (req: Request, res: Response) => {
  let user = await getUserById(req.params.id);

  if(!!user.error){
    res.status(400).json(user.error);
    return;
  }

  deleteUser(user.data as IUser).then((result) => {
    res.status(200).json(result);
  }).catch((error) => {
    res.status(400).json(error);
  });
};

export
{
  get,
  getById,
  post,
  put,
  remove,
};