import { deleteUser, getUserById, getAllUsers, insertUser, updateUser } from "../services/userService";
import IUser from "../types/IUser";
import { Request, Response } from "express";

const get = (req: Request, res: Response) => {
  getAllUsers().then((result) => {
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

const post = (req: Request, res: Response) => {
  insertUser(req.body as IUser).then((result) => {
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

const remove = (req: Request, res: Response) => {
  deleteUser(req.body as IUser).then((result) => {
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