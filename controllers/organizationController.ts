import { Request, Response } from 'express';
import { DeleteOrganization, 
  GetOrganizations, 
  InsertOrganization, 
  UpdateOrganization 
} from '../services/organization';
import { Organization } from '../types';

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
  const organization = Object.assign({} as Organization, req.body);
  organization.createdAt = new Date();
  organization.updatedAt = new Date();
  organization.valid = true;

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
  const organization = Object.assign({} as Organization, req.body);

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
  const organization = Object.assign({} as Organization, req.body);

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