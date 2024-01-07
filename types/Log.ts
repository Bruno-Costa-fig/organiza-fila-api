import Timestamp from "./Timestamp";

type Log = {
  createdAt: Timestamp;
  logType: string;
  dados: string;
}

export default Log;