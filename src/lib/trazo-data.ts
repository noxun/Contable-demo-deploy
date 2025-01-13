import axios from "axios";
import { PaymentRoll, ProcedureDataset } from "./trazoTypes";

export async function generatePayroll(procedureId: number) {
  const response = await axios.get(
    `https://trazo.tradecruz.com:8282/api/Tradecruz/${procedureId}/payroll`
  );
  return response.data as PaymentRoll;
}

export async function fetchProcedureDataset(procedureId: number) {

  const fieldnames = [
    "a-TributosYOtrosConceptosAduaneros",
    "b-OtrosGastosDeImportacion/Exportacion",
    "c-GastosDeOperaciones",
    "d-HonorariosProfesionales",
  ];

  const response = await axios.get(
    `https://trazo.tradecruz.com:8282/api/Procedure/${procedureId}/dataValues`, {
      params: {
        fieldnames
      }
    }
  );
  return response.data as ProcedureDataset;
}

export async function changeReceiptStatus(subDataId: number) {
  const response = await axios.post(
    `https://trazo.tradecruz.com:8282/api/dataSet/subData/${subDataId}/receipt`
  );
  return response.data;
}

//api/dataSet/subData/{subDataId}/receipt