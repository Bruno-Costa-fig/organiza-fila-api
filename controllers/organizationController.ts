import { Request, Response } from 'express';
import { DeleteOrganization, 
  GetOrganizations, 
  InsertOrganization, 
  UpdateOrganization 
} from '../services/organizationService';
import { IOrganization } from '../types';
import { v4 as uuidv4 } from 'uuid';


const GetAllOrganization = async (req: Request, res: Response) => {
  try {
    const dados = await GetOrganizations();
    res.status(200).json(dados);
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
    return;
  }
};

const PostOrganization = async (req: Request, res: Response) => {
  const organization = Object.assign({} as IOrganization, req.body);
  organization.createdAt = new Date();
  organization.updatedAt = new Date();
  organization.valid = true;
  organization.uid = uuidv4();

  try {
    const result = await InsertOrganization(organization);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
    return;
  }
};

const PutOrganization = async (req: Request, res: Response) => {
  const organization = Object.assign({} as IOrganization, req.body);

  try {
    const result = await UpdateOrganization(organization);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
    return;
  }
};

const RemoveOrganization = async (req: Request, res: Response) => {
  const organization = Object.assign({} as IOrganization, req.body);

  try {
    const result = await DeleteOrganization(organization);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
    return;
  }
};

export { GetAllOrganization, PostOrganization, PutOrganization, RemoveOrganization}