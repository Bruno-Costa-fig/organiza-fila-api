import Timestamp from "./Timestamp";

type Atendimento = {
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

export default Atendimento;