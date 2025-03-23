import axios from "axios";
import { DropdownOption, PaymentRoll, ProcedureDataset } from "./trazoTypes";
import { env } from "@/env";

const trazoUrl = env.NEXT_PUBLIC_TRAZO_URL;

export async function generatePayroll(procedureId: number) {
  const response = await axios.get(
    `${trazoUrl}/api/Tradecruz/${procedureId}/payroll`
  );
  return response.data as PaymentRoll;
}

export async function fetchProcedureDataset(procedureId: number) {
  // qs npm libreria para futura referencia
  // paramsSerializer: (params) => {
  //   return qs.stringify(params, { arrayFormat: "repeat" });
  // },

  const fieldnames = [
    "a-TributosYOtrosConceptosAduaneros",
    "b-OtrosGastosDeImportacion/Exportacion",
    "c-GastosDeOperaciones",
    "d-HonorariosProfesionales",
  ];

  const serializedFieldnames = fieldnames
    .map((fieldname) => `fieldnames=${encodeURIComponent(fieldname)}`)
    .join("&");

  const url = `${trazoUrl}/api/Procedure/${procedureId}/dataValues?${serializedFieldnames}`;

  const response = await axios.get(url);
  return response.data as ProcedureDataset;
}

export async function changeReceiptStatus(subDataId: number) {
  const response = await axios.put(
    `${trazoUrl}/api/dataSet/subData/${subDataId}/receipt`
  );
  return response.data;
}

export async function fetchPayrollDropdownOptions(
  urlLabel:
    | "atributos"
    | "botrosgastos"
    | "cgastosdeoperaciones"
    | "dhonorariosProfesionales"
) {
  const response = await axios.get(
    `${trazoUrl}/api/Dropdown/${urlLabel}/options`
  );
  return response.data as DropdownOption[];
}

export async function postSubData(values: {
  data: { label: string; description: number; description2: number };
  procedureId: number;
  fieldId: 531 | 532 | 533 | 534;
}) {
  const { data, procedureId, fieldId } = values;

  const response = await axios.post(
    `${trazoUrl}/api/dataSet/procedure/${procedureId}/field/${fieldId}/subdata`,
    data
  );
  return response.data;
}

export async function putSubData(values: {
  data: {
    label: string;
    description: number;
    description2: number;
    observation: number;
  };
  subDataId: number;
}) {
  const { data, subDataId } = values;
  const response = await axios.put(
    `${trazoUrl}/api/dataSet/procedure/subData/${subDataId}`,
    data
  );
  return response.data;
}

export async function deleteSubData(subDataId: number) {
  const response = await axios.delete(
    `${trazoUrl}/api/dataSet/procedure/subData/${subDataId}`
  );
  return response.data;
}

//api/dataSet/subData/{subDataId}/receipt
//https://trazo.tradecruz.com:8282/api/dataSet/procedure/subData/90052
