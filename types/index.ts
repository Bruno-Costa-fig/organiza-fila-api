export type Atendimento = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  prioridade: boolean;
  nome: string;
  finalizado: boolean;
  uid: string;
  organizationId: number;
  balcao: string;
  code: string;
}

export type Timestamp = {
  _seconds: number;
  _nanoseconds: number;
}

export type Balcao = {
  numero: number;
  valid: boolean;
}

export type Cliente = {
  nome: string;
  prioridade: boolean;
  organizationId: number;
  code: string;
}

export type BalcaoToken = {
  numero: number;
  valid: boolean;
}

export type UserLoginDTO = {
  email: string;
  password: string;
}

export type UserGet = {
  email: string;
  username: string;
  organizationId: number; 
  numero: string;
  role: string;
  valid: boolean;
  id?: number;
}

export type NewUserDTO = {
  email: string;
  password: string;
  username: string;
  organizationId: number; 
  numero: string;
  role: string;
}

export type TokenUser = {
  username: string;
  organizationId: number; 
  numero: string;
  role: string
}

export type TokenLogin = {
  token: string;
  user: TokenUser;
}

export type IOrganization = {
  name: string;
  cnpj: string;
  adminEmail: string;
  logoUrl: string;
  secondLogoUrl: string;
  thirdLogoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  limiteBalcoes: number;
  limitePaineis: number;
  limiteUsuarios: number;
  valid: boolean;
  uid: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ParametrosGetFirts = {
  key: string, value: string, comparador: string;
}

export type Log = {
  createdAt: Timestamp;
  logType: string;
  dados: string;
}

export enum LogType {
  INFO = "INFO",
  ERROR = "ERROR",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  REMOVE_CLIENT = "REMOVE_CLIENT",
}

