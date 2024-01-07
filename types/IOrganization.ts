export default interface IOrganization {
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
  processType: string;
  hasManualCode: boolean;
}