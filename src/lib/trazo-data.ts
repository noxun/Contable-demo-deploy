import axios from "axios";
import { DropdownOption, PaymentRoll, ProcedureDataset } from "./trazoTypes";

const trazoUrl = process.env.NEXT_PUBLIC_TRAZO_URL;

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
  data: { label: string; description: string; description2: string };
  procedureId: number;
  fieldId: 531 | 532 | 533 | 534;
}) {
  const { data, procedureId, fieldId } = values;

  const response = await axios.post(
    `/api/dataSet/procedure/${procedureId}/field/${fieldId}/subdat    a`,
    data
  );
  return response.data;
}

export async function putSubData(values: {
  data: {
    label: string;
    description: string;
    description2: string;
    observation: string;
  };
  subDataId: number;
}) {
  const { data, subDataId } = values;
  const response = await axios.put(
    `/api/dataSet/procedure/subData/${subDataId}`,
    data
  );
  return response.data;
}

export async function deleteSubData(subDataId: number) {
  const response = await axios.delete(
    `/api/dataSet/procedure/subData/${subDataId}`
  );
  return response.data;
}

//api/dataSet/subData/{subDataId}/receipt
//https://trazo.tradecruz.com:8282/api/dataSet/procedure/subData/90052
