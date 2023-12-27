import * as admin from "firebase-admin";
import { Atendimento, ParametrosGetFirts } from '../types/index';
import dotenv from "dotenv";
dotenv.config()

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount),
});

function compararPorUpdatedAt(a: Atendimento, b: Atendimento) {
  return b.updatedAt._seconds - a.updatedAt._seconds;
}

async function getFila(organizationId: number) {
  let dados: Atendimento[] = [];
  let error: string | null = null;

  const result = await admin
    .firestore()
    .collection("fila")
    .where("finalizado", "==", false)
    .where("balcao", "==", "")
    .where("organizationId", "==", organizationId)
    .limit(10)
    .get();

  if (!!result) {
    // @ts-ignore
    dados = result.docs
      .map((doc) => ({ ...doc.data(), uid: doc.id }))
      // @ts-ignore
      .sort(compararPorUpdatedAt);
  } else {
    error = "Erro ao buscar os dados!";
  }

  return { dados, error };
}

async function emAtendimento(organizationId: number) {
  let dados: Atendimento[] = [];
  let error: string | null = null;

  const result = await admin
    .firestore()
    .collection("fila")
    .where("finalizado", "==", false)
    .where("balcao", "!=", "")
    .where("organizationId", "==", organizationId)
    .get();

  if (!!result) {
    // @ts-ignore
    dados = result.docs
      .map((doc) => ({ ...doc.data(), uid: doc.id }))
      // @ts-ignore
      .sort(compararPorUpdatedAt);
  } else {
    error = "Erro ao buscar os dados!";
  }

  return { dados, error };
}

async function getProximo(organizationId: number, prioridade: boolean = false) {
  let dados = {} as Atendimento;
  let error: string | null = null;

  const result = await admin
    .firestore()
    .collection("fila")
    .where("finalizado", "==", false)
    .where("prioridade", "==", prioridade)
    .where("balcao", "==", "")
    .where("organizationId", "==", organizationId)
    .get();

  if (!!result) {
    let sortedArray = result.docs
      .map((doc) => ({ ...doc.data(), uid: doc.id }))
      // @ts-ignore
      .sort(compararPorUpdatedAt);
    
      // @ts-ignore
      dados = sortedArray[0];
  } else {
    error = "Erro ao buscar os dados!";
  }

  return { dados, error };
}

async function getAtual(balcao: string, organizationId: number) {
  let dados: Atendimento = {} as Atendimento;
  let error: string | null = null;

  if (!balcao) {
    error = "É necessário informar o número do balcão";
    return { dados, error };
  }

  const result = await admin
    .firestore()
    .collection("fila")
    .where("finalizado", "==", false)
    .where("balcao", "==", balcao)
    .where("organizationId", "==", organizationId)
    .limit(1)
    .get();

  if (!!result) {
    let sortedArray = result.docs
      .map((doc) => ({ ...doc.data(), uid: doc.id }))
      // @ts-ignore
      
      .sort(compararPorUpdatedAt);
      // @ts-ignore
    dados = sortedArray[0];
  } else {
    error = "Erro ao buscar os dados!";
  }

  return { dados, error };
}

async function novoCliente(cliente: Atendimento) {
  if (!cliente) {
    return null;
  }

  try {
    await admin.firestore().collection("fila").add(cliente);

    return "Adicionado a fila com sucesso!";
  } catch (erro) {
    return null;
  }
}

async function updateCliente(uid: string, cliente: Atendimento) {
  if (!cliente || !uid) {
    return null;
  }

  try {
    const ref = admin.firestore().collection("fila").doc(uid);

    await ref.set(cliente);
    return "Atualizado com sucesso!";
  } catch (erro) {
    return null;
  }
}

async function deleteCliente(uid: string, cliente: Atendimento) {
  if (!cliente || !uid) {
    return null;
  }

  try {
    const ref = admin.firestore().collection("fila").doc(uid);

    await ref.delete();
    return "Removido com sucesso!";
  } catch (erro) {
    return null;
  }
}

// BASES

async function base_insert<T>(collection: string, model: T) {
  if (!model) {
    return null;
  }

  try {
    await admin.firestore().collection(collection).add(model);

    return "Adicionado com sucesso!";
  } catch (erro) {
    return null;
  }
}

async function base_get_all<T>(collection: string, organizationId: number) {
  let dados: T[] = [];
  let error: string | null = null;

  const result = await admin
    .firestore()
    .collection(collection)
    .where("organizationId", "==", organizationId)
    .get();

  if (!!result) {
    let list = result.docs
      .map((doc) => ({ ...doc.data(), uid: doc.id }))
      // @ts-ignore
    dados = list;
  } else {
    error = "Erro ao buscar os dados!";
  }

  return { dados, error };
}

async function base_get_first<T>(collection: string, organizationId: number, parametros: ParametrosGetFirts) {
  let dados: T | null= null;
  let error: string | null = null;

  if (!parametros.value || !parametros.key || !collection || !["==", "!=", ">", "<", ">=", "<="].includes(parametros.comparador)) {
    error = "É necessário informar todos os parâmetros válidos";
    return { dados, error };
  }

  const result = await admin
    .firestore()
    .collection(collection)
    // @ts-ignore
    .where(parametros.key, parametros.comparador, parametros.value)
    .where("organizationId", "==", organizationId)
    .limit(1)
    .get();

  if (!!result) {
    let sortedArray = result.docs
      .map((doc) => ({ ...doc.data(), uid: doc.id }))
      // @ts-ignore
    dados = sortedArray[0];
  } else {
    error = "Erro ao buscar os dados!";
  }

  return { dados, error };
}

async function base_update<T>(collection: string, organizationId: number, uid: string, model: T) {
  if (!model || !uid) {
    return null;
  }

  try {
    const ref = admin.firestore().collection(collection).doc(uid);

    await ref.set(model);
    return "Atualizado com sucesso!";
  } catch (erro) {
    return null;
  }
}

async function base_delete<T>(collection: string, uid: string, model: T) {
  if (!model || !uid) {
    return null;
  }

  try {
    const ref = admin.firestore().collection(collection).doc(uid);

    await ref.delete();
    return "Removido com sucesso!";
  } catch (erro) {
    return null;
  }
}

async function insert_log(dados: string, logType: string){
  if (!dados) {
    return null;
  }

  let log = {
    createdAt: admin.firestore.Timestamp.now(),
    logType: logType,
    dados: dados,
  }

  try {
    await admin.firestore().collection("logs").add(log);

    return "Log armazenado com sucesso!";
  } catch (erro) {
    return null;
  }
}

export {
  getFila,
  getAtual,
  novoCliente,
  updateCliente,
  emAtendimento,
  getProximo,
  deleteCliente,

  base_insert,
  base_get_all,
  base_get_first,
  base_update,
  base_delete,
};
