import express, { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import * as admin from "firebase-admin";
import cors from "cors";
import {
  getFila,
  getProximo,
  novoCliente,
  updateCliente,
  getAtual,
  deleteCliente,
  hasCode,
} from "./services/firebase-functions";

import * as OrganizationController from "./controllers/organizationController";
import * as UserController from "./controllers/userController";

import dotenv from "dotenv";
dotenv.config()
import { Atendimento } from "./types";
import { LoginUser, getUserInfo } from "./services/auth";
import { getBalcaoLogsById, getBalcaoLogsByIdLast, inserBalcaoLogs } from "./services/balcaoLogsService";

const app = express();
const port = process.env.PORT;

const options: cors.CorsOptions = {
  origin: "*"
};

app.use(cors(options));
app.use(express.json());

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Obtenha o token do header 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // Se não houver token, retorne um erro 401 (não autorizado)
  }

  // @ts-ignore
  jwt.verify(token, process.env.SECRET, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403); // Se o token for inválido, retorne um erro 403 (proibido)
    }

    next(); // Continue para a próxima função middleware ou rota
  });
}

app.get("/api/fila", authenticateToken, async (req, res) => {
  let token = req.headers.authorization;
  token = token?.replace("Bearer ", "");

  // @ts-ignore
  let info = getUserInfo(token);
  let userLogado = JSON.parse(info?.result || "{}");

  const result = await getFila(userLogado.tokenUser.organizationId);

  if (!!result.dados) {
    res.send(result.dados);
  } else {
    res.send(result.error ?? "Erro ao buscar os dados!");
    res.status(500);
    res.end();
  }
});

app.post("/api/cliente", authenticateToken, async (req, res) => {
  const cliente = {
    nome: req.body.nome,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
    finalizado: false,
    prioridade: req.body.prioridade,
    organizationId: req.body.organizationId,
    balcao: "",
    uid: "",
    code: req.body.code,
  };

  if(!!cliente.code){
    let alreadyExists = await hasCode(cliente.code, cliente.organizationId);

    if(!!alreadyExists.dados){
      res.status(400).send("Já existe um cliente com esse código!");
      res.end();
      return;
    }
  }

  // @ts-ignore
  const result = await novoCliente(cliente);

  if (result == null) {
    res.status(400).send("Erro ao adicionar a fila!");
    res.end();
    return;
  }
  
  res.send(result);
});

app.get("/api/atual/:balcao", authenticateToken, async (req, res) => {
  let balcaoParams = req.params.balcao;

  let token = req.headers.authorization;
  token = token?.replace("Bearer ", "");

  // @ts-ignore
  let info = getUserInfo(token);
  let userLogado = JSON.parse(info?.result || "{}");

  try {
    let atual = await getAtual(balcaoParams, userLogado.tokenUser.organizationId);

    res.send(atual);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao atualizar dados!");
    res.end();
  }
});

app.get("/api/novamente/:balcao", authenticateToken, async (req, res) => {
  let balcaoParams: string = req.params.balcao;

  let token = req.headers.authorization;
  token = token?.replace("Bearer ", "");

  // @ts-ignore
  let info = getUserInfo(token);
  let userLogado = JSON.parse(info?.result || "{}");

  try {
    let atual = await getAtual(balcaoParams, userLogado.tokenUser.organizationId);
    let cliente: Atendimento = atual.dados;
    if(!!cliente){
      // @ts-ignore
      cliente.updatedAt = admin.firestore.Timestamp.fromDate(new Date()); 
      await updateCliente(cliente.uid, cliente);
    }

    res.send(atual);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao atualizar dados!");
    res.end();
  }
});

app.put("/api/finalizar/:uid", authenticateToken, async (req, res) => {
  let uidParams = req.params.uid;

  try {
    const cliente = req.body;
    cliente.finalizado = true;
    cliente.updatedAt = admin.firestore.Timestamp.fromDate(new Date()); 

    await deleteCliente(uidParams, cliente);
    res.send("Cliente finalizado com sucesso!");
  } catch (erro) {
    res.status(500).send("Erro ao atualizar dados!");
    res.end();
  }
});

/**
 * POST /api/proximo/:balcao/:uid
 * 
 * Calcula o próximo cliente a ser atendido.
 * 
 * @param balcao - Número do balcão que solicitou o próximo cliente.
 * @param uid - Uid do cliente atual que ele está atendendo para ser finalizado.
 * @returns O próximo cliente a ser atendido.
 */
app.post("/api/proximo/:balcao/:uid", authenticateToken, async (req, res) => {
  let uidParams: string = req.params.uid;
  let balcaoParams: string = req.params.balcao;

  let clienteRes: Atendimento | null = null;
  let error: string | null = null;

  let token = req.headers.authorization;
  token = token?.replace("Bearer ", "");

  // @ts-ignore
  let info = getUserInfo(token);
  let userLogado = JSON.parse(info?.result || "{}");

  try {
    if (uidParams != '0') {
      const cliente = req.body;
      cliente.finalizado = true;

      await deleteCliente(uidParams, cliente);
    }

    let getLog = await getBalcaoLogsByIdLast(userLogado.tokenUser.organizationId, balcaoParams);
    let prioridade = !getLog.data?.prioridade ?? false;

    let getProx = await getProximo(userLogado.tokenUser.organizationId, prioridade);

    if(getProx.error == null && getProx.dados == null){
      prioridade = !prioridade;
      getProx = await getProximo(userLogado.tokenUser.organizationId, prioridade);
    }

    if (getProx.error == null && !!getProx.dados) {
      let proximo: Atendimento = getProx.dados;
      proximo.balcao = balcaoParams;
      // @ts-ignore
      proximo.updatedAt = admin.firestore.Timestamp.fromDate(new Date()); 
      await updateCliente(proximo.uid, proximo);
      clienteRes = proximo;

      await inserBalcaoLogs(userLogado.tokenUser.organizationId, {
        atendimentoId: proximo.uid,
        balcaoId: Number(balcaoParams),
        createdAt: new Date(),
        updatedAt: new Date(),
        prioridade: prioridade,
        code: proximo.code ?? "",
      });

    } else {
      error = getProx.error ?? "Não há clientes na fila!";
    }

    res.send(clienteRes ?? error);
  } catch (erro) {
    res.status(500).send("Erro ao atualizar dados!");
    res.end();
  }
});


// organizations
app.get("/api/organizations", authenticateToken, OrganizationController.GetAllOrganization);
app.post("/api/organizations", authenticateToken, OrganizationController.PostOrganization);
app.put("/api/organizations", authenticateToken, OrganizationController.PutOrganization);
app.delete("/api/organizations", authenticateToken, OrganizationController.RemoveOrganization);

app.get("/api/users", authenticateToken, UserController.get);
app.get("/api/users/:id", authenticateToken, UserController.getById);
app.post("/api/users", authenticateToken, UserController.post);
app.put("/api/users", authenticateToken, UserController.put);
app.delete("/api/users/:id", authenticateToken, UserController.remove);

app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      status: "error",
      message: "Dados inválidos",
    });
    return;
  }

  try {
    const token = await LoginUser({ email, password });

    if (!token || !!token.error) {
      res.status(404).json({
        status: "error",
        message: "Usuário não encontrado",
      });
      return;
    }

    res.status(200).json(token);
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.listen(port, () =>
  console.log(`Servidor ouvindo em http://localhost:${port}`)
);
