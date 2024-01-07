import { IOrganization } from "../types";
import Organization from "../model/Organization";
import { getAll, getById, create, update, remove, getWhere } from "./baseCrud";
import { v4 as uuidv4 } from "uuid";

async function GetOrganizations() {
  let data = [] as IOrganization[];
  let error = null;
  try {
    const users = await getAll(Organization);
    data = users.map((Organization: any) =>
      Organization.toJSON()
    ) as IOrganization[];
  } catch (error) {
    console.error("Error getting all organizations:", error);
    error = error;
  }

  return {
    data,
    error,
  };
}

const GetOrganizationById = async (id: string | number) => {
  let data = {} as IOrganization;
  let error = null;
  try {
    // @ts-ignore
    data = await getById(Organization, id);
  } catch (error) {
    console.error("Error getting organization:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

const InsertOrganization = async (organization: IOrganization) => {
  let data = {} as IOrganization;
  let error = null;

  try {
    let hasSame = await getWhere(Organization, "cnpj", organization.cnpj);
    if (!!hasSame) {
      error = "Já existe uma empresa com esse CNPJ!";
      return {
        data,
        error,
      };
    }
    // @ts-ignore
    data = await create(Organization, organization);
  } catch (error) {
    console.error("Error create organization:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

const UpdateOrganization = async (organization: IOrganization) => {
  let data = {} as IOrganization;
  let error = null;
  try {
    // @ts-ignore
    data = await update(Organization, organization.id, organization);
  } catch (error) {
    console.error("Error update organization:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

const DeleteOrganization = async (organization: IOrganization) => {
  let data = {} as IOrganization;
  let error = null;
  try {
    // @ts-ignore
    data = await remove(Organization, organization.id, organization);
  } catch (error) {
    console.error("Error remove organization:", error);
    error = error;
  }

  return {
    data,
    error,
  };
};

function syncForce() {
  Organization.sync({ force: true })
    .then(() => {
      console.log("Organization table created successfully");
      Organization.create({
        id: 1,
        name: "Iguatec",
        cnpj: "46067411000103",
        adminEmail: process.env.EMAIL_ADMIN,
        limiteBalcoes: "10000",
        limitePaineis: "10000",
        limiteUsuarios: "10000",
        valid: true,
        uid: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    })
    .catch((error) =>
      console.error("Error creating organization table:", error)
    );
}

function sync() {
  Organization.sync({ alter: true })
    .then(() => {
      console.log("Organization table updated successfully");
    })
    .catch((error) =>
      console.error("Error creating organization table:", error)
    );
}

// sync();

export {
  InsertOrganization,
  GetOrganizationById,
  GetOrganizations,
  UpdateOrganization,
  DeleteOrganization,
};
