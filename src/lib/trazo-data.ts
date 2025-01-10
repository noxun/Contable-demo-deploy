import axios from "axios";
import { PaymentRoll } from "./trazoTypes";

export async function generatePayroll(procedureId: number) {
  const response = await axios.get(
    `https://trazo.tradecruz.com:8282/api/Tradecruz/${procedureId}/payroll`
  );
  return response.data as PaymentRoll;
}
