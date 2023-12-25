export default interface IUser {
  username: string;
  password: string;
  token: string;
  valid: boolean;
  email: string;
  uid: string;
  organizationId: string;
  createdAt: Date;
  numero: string;
  id: number;
  role: string;
}