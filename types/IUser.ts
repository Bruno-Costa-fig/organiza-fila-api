export default interface IUser {
  username: string;
  password: string;
  token: string;
  valid: boolean;
  email: string;
  uid: string;
  organizationId: string;
  createdAt: Date;
  type: string;
  numero: string;
  id: number;
  role: string;
}