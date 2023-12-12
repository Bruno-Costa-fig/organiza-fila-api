import { Organization } from "../types";
import {base_delete, base_get_all, base_insert, base_update} from "./firebase-functions";

async function GetOrganizations() {
  try {
    const result = base_get_all<Organization>("organizations");
    return result;
  } catch (error) {
    // @ts-ignore
    return 'Erro: ' + error.message;
  }
}

async function InsertOrganization(empresa: Organization) {
  try {
    const result = await base_insert<Organization>("organizations", empresa);
    return result;
  } catch (error) {
    // @ts-ignore
    return 'Erro: ' + error.message;
  }
}

async function UpdateOrganization(empresa: Organization) {
  try {
    const result = await base_update<Organization>("organizations", empresa.uid, empresa);
    return result;
  } catch (error) {
    // @ts-ignore
    return 'Erro: ' + error.message;
  }
}

async function DeleteOrganization(empresa: Organization) {
  try {
    const result = await base_delete<Organization>("organizations", empresa.uid, empresa);
    return result;
  } catch (error) {
    // @ts-ignore
    return 'Erro: ' + error.message;
  }
}

export {InsertOrganization, GetOrganizations, UpdateOrganization, DeleteOrganization};