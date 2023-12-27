interface IBalcaoLogs {
  id?: number;
  balcaoId: number;
  atendimentoId: string;
  prioridade: boolean;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export default IBalcaoLogs;
