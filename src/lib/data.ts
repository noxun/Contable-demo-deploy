import {
  AccountingBox,
  AccountingBoxBalance,
  AccountingBoxItems,
  AccountRelation,
  Bank,
  BankExcerpt,
  BankExtractPaymentFile,
  BookBiggerData,
  Branch,
  BranchToList,
  ConfigValues,
  CostCenter,
  DiaryBookResponse,
  HeritageEvaluationData,
  InvoiceRegistry,
  InvoiceRegistryResponseByType,
  InvoiceRegistryType,
  InvoiceVoucher,
  ModelSeat,
  ModelSeatDetailResponse,
  NewConfigValues,
  PostModelSeat,
  RegisterVoucherByDocumentResponse,
  Role,
  RoleMenu,
  SendAllSubDatas,
  SiatMotionAccount,
  TrazoCompany,
  TrazoInternCode,
  TypeCompany,
  Ufv,
  VoucherItemFromExtractedPDF,
} from "./types";
import { api } from "./api";
import { UfvRegister } from "@/modules/ufv/components/UfvRegisterForm";
import { Voucher, VoucherType } from "@/modules/shared/types/sharedTypes";
import { LinkAccountForm } from "@/modules/link/components/LinkAccountForm";
import { Account } from "@/modules/account/types/account";
import { NewAccountingBox } from "@/modules/accounting-box/components/NewAccountingBoxForm";
import { RegisterForm } from "@/app/dashboard/users/new/page";
import { EditModelSeat } from "@/modules/model-seats/components/FormEditModelSeat";
import { NewInvoiceForm } from "@/modules/invoice-registry/components/FormNewInvoiceRegistry";
import { VoucherDeleteVariables } from "@/modules/shared/components/DeleteVoucherDialog";
import {
  FixedAsset,
  FixedAssetsAll,
  SchemaFixedAsset,
} from "@/modules/fixed-assets/types/types";
import {
  ItemPayment,
  Payroll,
  ResponsePayrolls,
  ResponseSalariesAndPayrolls,
  Salaries,
  SchemaPayrollType,
  SchemaSalaryType,
} from "@/modules/salaries-payrolls/types/types";
import { RegisterVoucherByDocuments } from "./trazoTypes";
import { LevelData } from "@/modules/results/types/types";

export function setAuthToken(token: string | undefined | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export async function fetchUfvValues(): Promise<Ufv> {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/Ufv/get`);
  return response.data;
}

export async function postUfvValues(data: UfvRegister | NewConfigValues) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post(`/api/Ufv/registerUfvDollar`, data);
  return response.data;
}

export async function fetchConfigValues() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get("/api/Ufv/getConfigValues");
  return response.data as ConfigValues;
}

export async function fetchVouchers(
  voucherType: VoucherType,
  page: number = 1,
  pageSize: number = 10,
  siat: "" | "siat" = ""
) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/Voucher/all${siat}`, {
    params: {
      type: voucherType,
      PageNumber: page,
      PageSize: pageSize,
    },
  });

  const paginationHeader = response.headers;

  const paginationInfo = paginationHeader
    ? JSON.parse(paginationHeader["pagination"])
    : null;

  //console.log("what",paginationInfo);
  return {
    data: response.data as Voucher[],
    pagination: paginationInfo,
  };
}

export async function editVoucher(data: Voucher) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.put(`/api/Voucher`, data);
  return response.data;
}

export async function deleteVoucher({
  voucherId,
  voucherType,
}: VoucherDeleteVariables) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.delete("/api/Voucher", {
    params: {
      id: voucherId,
      type: voucherType,
    },
  });
  return response.data;
}

export async function fetchAllMotionAccountsWithRelations() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/Account/Relations`);
  return response.data as AccountRelation[];
}

export async function fetchAllSiatMotionAccounts() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/Account/SiatMotion`);
  return response.data as SiatMotionAccount[];
}

export async function postConciliation(data: LinkAccountForm) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post(`/api/Conciliation`, data);
  return response.data;
}

export async function deleteConciliation(data: LinkAccountForm) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  //cambiar esto para que reciba ya sea paths o queryStrings
  const response = await api.delete(`/api/Conciliation`, { data: data });
  return response.data;
}

export async function fetchAllModelSeats(type: number | null = null) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);

  const response = await api.get(`/api/ModelSeat`, {
    params: {
      Type: type,
    },
  });
  return response.data as ModelSeat[];
}

export async function deleteModelSeat(modelSeatId: number) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);

  const response = await api.delete("api/ModelSeat", {
    params: {
      modelSeatId,
    },
  });
  return response.data;
}

export async function fetchAllMotionAccounts() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/Account/Filter`, {
    params: {
      isMotion: true,
    },
  });
  return response.data as Account[];
}

export async function postModelSeat(data: PostModelSeat) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post("/api/ModelSeat", data);
  return response.data;
}

export async function fetchModelSeatsItems(modelSeatId: string) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/ModelSeat/detail`, {
    params: {
      modelSeatId: modelSeatId,
    },
  });
  return response.data as ModelSeatDetailResponse;
}

export async function putModelSeat(data: EditModelSeat) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.put("/api/ModelSeat", data);
  return response.data;
}

export async function fetchTypeCompanies() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/TypeCompany`);
  return response.data as TypeCompany[];
}

export async function importAccountFromExcel(data: FormData) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post(`/api/Account/ReadXlxs`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function importBankExcerptFromExcel(data: FormData) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post(`/api/bank/extract`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function fetchAccountingBox(): Promise<AccountingBox[]> {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/AccountingBox`);
  return response.data as AccountingBox[];
}

export async function fetchCostCenter(): Promise<CostCenter[]> {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/CostCenter`);
  return response.data as CostCenter[];
}

export async function fetchBranches() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/Sucursal`);
  return response.data as Branch[];
}

export async function createNewBranch(data: Branch) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post(`/api/Sucursal`, data);
  return response.data;
}

export async function fetchAllRoles() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/Rol`);
  return response.data as RoleMenu[];
}

export async function fetchUserRoles(userId: number) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/Users/getRol/${userId}`);
  return response.data as Role[];
}

export async function fetchBankExcerpt(bankId: string) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/bank/getextract/${bankId}`);
  return response.data as BankExcerpt[];
}

// export async function fetchBankExcerptData(bankExcerptId: string) {
//   let token;
//   if (typeof window !== "undefined") {
//     token = localStorage.getItem("token");
//   }
//   setAuthToken(token);
//   const response = await api.get(`/api/bank/getextractDetail/${bankExcerptId}`);
//   return response.data as BankExcerptData[];
// }

export async function fetchBranchList() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/Sucursal/list`);
  return response.data as BranchToList[];
}

export async function registerExtractToSeat(data: {
  type: string;
  bankExtractId: number;
  accountId: number; //accountId de contra cuenta
}) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post("/api/Bank/registerSeat", data);
  return response.data;
}

export async function registerToTrazo(bankExtractId: number) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post("/api/Bank/registerTrazo", {
    bankExtractId,
  });
  return response.data;
}

export async function fetchAllAccounts() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get("/api/Account/Filter?isMotion=true");
  return response.data as Account[];
}

export async function fetchAccountsByType(type: number) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get("/api/Account/All", {
    params: {
      typeCompanyId: type,
    },
  });
  return response.data as Account[];
}

export async function fetchTrazoInternCodes(page = 1, pageSize=10, searchQuery: string) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get("/api/Trazo/interncode", {
    params: {
      PageNumber: page,
      PageSize: pageSize,
      codeIntern: searchQuery,
    }
  });
  console.log(response)

  const paginationHeader = response.headers;
  const paginationInfo = paginationHeader
  ? JSON.parse(paginationHeader["pagination"])
  : null;

  console.log("what",paginationInfo);

  return {
    data: response.data as TrazoInternCode[],
    pagination: paginationInfo,
  }
}

export async function fetchTrazoInternCodesByCompanyId(companyId: number) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(
    `/api/Trazo/interncodes/companies/${companyId}`
  );
  return response.data as TrazoInternCode[];
}

export async function fetchTrazoCompanies() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get("/api/Trazo/companies");
  return response.data as TrazoCompany[];
}

export async function postCompanyOrConcept(data: { name: string }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post("/api/Company", data);
  return response.data as {
    id: number;
    name: string;
    descripcion: any;
    sigla: any;
  };
}

export async function fetchAccountingBoxItemsById(accountingBoxId: number) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get("/api/AccountingBox/items", {
    params: {
      AccountingBoxId: accountingBoxId,
    },
  });
  return response.data as AccountingBoxItems[];
}

export async function createAccountingBoxItems(data: NewAccountingBox) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post("/api/AccountingBox/createItems", data);
  return response.data;
}

export async function getAccountingBoxBalance(accountingBoxId: number) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(
    `/api/AccountingBox/balance/${accountingBoxId}`
  );
  return response.data as AccountingBoxBalance;
}

export async function fetchAllBanks() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get("/api/Bank");
  return response.data as Bank[];
}

export async function deleteBankExtract(bankExtractId: number) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.delete(`/api/Bank/delete/${bankExtractId}`);
  return response.data;
}

export async function registerPayment(data: FormData) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post(`/api/Bank/RegisterPaymet`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function fetchBankExtractFiles(bankExtractId: number) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(
    `/api/Bank/GetFilesBankExtract/${bankExtractId}`
  );
  return response.data as BankExtractPaymentFile[];
}

export async function changeBankExtractStatus(bankExtractId: number) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post(`/api/Bank/ChangeStatus/${bankExtractId}`);
  return response.data as boolean;
}

export async function registerUser(data: RegisterForm) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post("/Auth/register", data);
  return response.data;
}

export async function fetchBankExtractAccountDetails(
  BankExtractId: number,
  AccountId: number
) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get("/api/Bank/seatContable", {
    params: {
      BankExtractId,
      AccountId,
    },
  });
  return response.data;
}

export async function fetchInvoiceRegistryList() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get("/api/Invoice"); //TODO:ADD CORRECT ENDPOINT
  return response.data as InvoiceRegistry[];
}

export async function postInvoiceRegistry(data: NewInvoiceForm) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post(`/api/Invoice/`, data);
  return response.data;
}

export async function getMassPurchaseFormInExcel(type: InvoiceRegistryType) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/GenerateInvoice/${type}`, {
    responseType: "text",
  });
  return response.data as string;
}

export async function getSingleAccountReport(data: any) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post(`/api/report/printbook`, data, {
    responseType: "text",
  });
  return response.data as string;
}

export async function deleteInvoiceRegistryById(InvoiceRegistryId: number) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.delete(`/api/Invoice/${InvoiceRegistryId}`);
  return response.data;
}

export async function fetchSingleInvoiceRegistryById(
  InvoiceRegistryId: number
) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/Invoice/${InvoiceRegistryId}`);
  return response.data as InvoiceRegistry;
}

export async function editInvoiceRegistryById(data: InvoiceRegistry) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.put(`/api/Invoice/${data.id}`, data);
  return response.data;
}

export async function importInvoiceRegistryExcel(data: FormData) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);

  const numType = data.get("InvoiceRegistryType");

  data.delete("InvoiceRegistryType");

  const response = await api.post(`/exelInvoice/${numType}`, data);
  return response.data;
}

export async function fetchInvoiceRegistryByType(type: InvoiceRegistryType) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/CompraVentaType/${type}`);
  return response.data as InvoiceRegistryResponseByType[];
}

export async function fetchInvoiceVoucherDetailsById(
  invoiceRegistryId: number
) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(
    `api/invoice/SeatContable/${invoiceRegistryId}`
  );
  return response.data as InvoiceVoucher[];
}

export async function numberToLiteral(number: number, inSus: boolean = false) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/Auth/NumberToLiteral/${number}`, {
    params: {
      inSus,
    },
    responseType: "text",
  });
  return response.data as string;
}

interface QueryParams {
  initDate?: string;
  endDate?: string;
  inSus?: boolean;
  level?: number
}

export async function getApiReportExcel(
  path: string,
  queryParams: QueryParams,
  pathType?: string,
) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const typePath = pathType ? `/${pathType}` : "";
  const URLRequest = `/api/Report/${path}${typePath}`;

  setAuthToken(token);
  const response = await api.get(URLRequest, {
    params: queryParams,
  });
  return response.data;
}
//BIGGER BOOK
export async function searchByAccountBigguerBook(search: string) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const URLRequest = `/api/Report/BookBiggerData`;

  setAuthToken(token);
  const response = await api.get(URLRequest, {
    params: { search },
  });
  return response.data;
}
//GET: Excel for bigger book
export async function getBigguerBookinExcel({
  initDate,
  endDate,
  search,
}: {
  initDate?: string;
  endDate?: string;
  search?: string;
}) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const URLRequest = `/api/Report/BookBigguerDataExel`;

  setAuthToken(token);
  const response = await api.get(URLRequest, {
    params: {
      initDate: initDate,
      endDate: endDate,
      search: search,
    },
  });
  return response.data;
}

//obtener el listado de activos
interface Assets {
  id: number;
  typeActive: string;
}
export async function getAllAssets() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const URLRequest = `/FixedAssets/FixedAssets`;

  setAuthToken(token);
  const { data } = await api.get<Assets[]>(URLRequest);
  return data;
}

//crear un nuevo activo Fijo
export async function postAssetFixed(FixedAsset: SchemaFixedAsset) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `/FixedAssets`;

  setAuthToken(token);
  const { data } = await api.post(URLRequest, FixedAsset);
  return data;
}

//crear un nuevo activo Fijo
export async function putAssetFixed({
  IdAssets,
  fixedAsset,
}: {
  IdAssets: string;
  fixedAsset: SchemaFixedAsset;
}) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `/FixedAssets`;

  setAuthToken(token);
  const { data } = await api.put(URLRequest, fixedAsset, {
    params: { IdAseets: IdAssets },
  });
  return data;
}

// obtener un activoFijo por Id
export async function getFixedAsset({ id }: { id: string }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  if (!id || id.length === 0) return null;

  const URLRequest = `/FixedAssets/items/${id}`;

  setAuthToken(token);
  try {
    const { data } = await api.get<FixedAsset>(URLRequest);
    return data;
  } catch (error) {
    console.error("Error al obtener el activo fijo:", error);
    return null;
  }
}
// obtener la lista de activos fijos
export async function getAllFixedAssets({ dateTime }: { dateTime: string }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `/FixedAssets`;

  setAuthToken(token);
  const { data } = await api.get<FixedAssetsAll[]>(URLRequest, {
    params: { dateTime },
  });
  return data[0];
}

// eliminar un elemento de la lista de activos fijos
export async function deleteFixedAsset({ id }: { id: string }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `/FixedAssets?IdAssets=${id}`;

  setAuthToken(token);
  const { data } = await api.delete(URLRequest, {
    params: {
      IdAseets: id,
    },
  });
  return data;
}

// GET; obtener el archivo excel de activos fijos
export async function getAllFixedAssetsExcelByDate({ date }: { date: string }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const URLRequest = `/FixedAssets/FixedAssetsItems/exel`;

  setAuthToken(token);
  const { data } = await api.get(URLRequest, {
    params: { date: date },
  });
  return data;
}

//Crear una banco apartir de una cuenta
export async function postConvertAccountToBank(accountId: string) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/Bank/ByAccount/${accountId}`;

  setAuthToken(token);
  const { data } = await api.post(URLRequest, accountId);
  return data;
}

//CRUD: Planillas --> Payrolls
//POST: Payrolls
export async function PostPayroll({ payroll }: { payroll: SchemaPayrollType }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/SalariesAndWages`;

  setAuthToken(token);
  const { data } = await api.post(URLRequest, payroll);
  return data;
}
//GET: Payrolls
export async function GetPayrolls({ date }: { date: string }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/SalariesAndWages/itemsGeneral`;

  setAuthToken(token);
  const { data } = await api.get<ResponsePayrolls>(URLRequest, {
    params: {
      date: date,
    },
  });
  return data;
}
//GET Payrolls and Salaries
export async function GetPayrollsAndSalaries({ date }: { date: string }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `/api/SalariesAndWages/itemsMonth`;

  setAuthToken(token);
  const { data } = await api.get<ResponseSalariesAndPayrolls>(URLRequest, {
    params: {
      date: date,
    },
  });
  return data;
}
//GET By Id: Payrolls
export async function GetPayrollExcelByDate({ date }: { date: string }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/SalariesAndWages/itemsExel`;

  setAuthToken(token);
  const { data } = await api.get(URLRequest, {
    params: {
      date: date,
    },
  });
  return data;
}
//GET By Id: Payrolls
export async function GetPayrollById({ id }: { id: string }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/SalariesAndWages/id`;

  setAuthToken(token);
  const { data } = await api.get(URLRequest, {
    params: {
      id: id,
    },
  });
  return data;
}
//UPDATE By Id: Payrolls
export async function UpdatePayrollById({
  id,
  idItem,
  payroll,
}: {
  id: string;
  idItem: string;
  payroll: Payroll & ItemPayment;
}) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/SalariesAndWages/id`;

  setAuthToken(token);
  const { data } = await api.put(URLRequest, payroll, {
    params: {
      id: id,
      IdItems: idItem
    },
  });
  return data;
}
//UPDATE Paid By employeeId
export async function updatePaymentStatusByEmployeeId({
  idEmployee,
  paid,
}: {
  idEmployee: string;
  paid: boolean;
}) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/SalariesAndWages/items/IsPaid`;

  setAuthToken(token);
  const { data } = await api.put(URLRequest, idEmployee, {
    params: {
      id: idEmployee,
      IsPaid: paid,
    },
  });
  return data;
}
//DELETE: Payrolls
export async function DeletePayroll({ id }: { id: string }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/SalariesAndWages/id`;

  setAuthToken(token);
  const { data } = await api.delete(URLRequest, {
    params: {
      id: id,
    },
  });
  return data;
}

//GET: Items of Payrolls
export async function GetSalariesByPayrollId({
  idPayroll,
}: {
  idPayroll: string;
}) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/SalariesAndWages/items/id`;

  setAuthToken(token);
  const { data } = await api.get<Payroll>(URLRequest, {
    params: {
      id: idPayroll,
    },
  });
  return data;
}
//GET: Items of Payrolls
export async function GetSalariesById({ id }: { id: string }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/SalariesAndWages/itemsDatos/id`;

  setAuthToken(token);
  const { data } = await api.get<Salaries>(URLRequest, {
    params: {
      id: id,
    },
  });
  return data;
}
//POST: Items of Payrolls
export async function PostSalary({ Item }: { Item: SchemaSalaryType }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/SalariesAndWages/items`;

  setAuthToken(token);
  const { data } = await api.post(URLRequest, Item);
  return data;
}
//DELETE: Items of Payrolls
export async function DeleteSalary({ id }: { id: string }) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/SalariesAndWages/items/id`;

  setAuthToken(token);
  const { data } = await api.delete(URLRequest, {
    params: {
      id: id,
    },
  });
  return data;
}
//UPDATE: Items of Payrolls
export async function UpdateSalary({
  id,
  item,
}: {
  id: string;
  item: SchemaSalaryType;
}) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/SalariesAndWages/items/id`;

  setAuthToken(token);
  const { data } = await api.put(URLRequest, item, {
    params: {
      id: id,
    },
  });
  return data;
}

//Crear una a caja apartir de una cuenta
export async function postConvertAccountToAccountingBox(accountId: string) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/AccountingBox/ByAccount/${accountId}`;

  setAuthToken(token);
  const { data } = await api.post(URLRequest, accountId);
  return data;
}

export async function fetchVoucherItemsFromExtractedPDF(bankExtractId: number) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  setAuthToken(token);
  const response = await api.get(`/api/Bank/Extract/Entries/${bankExtractId}`);
  return response.data as VoucherItemFromExtractedPDF[];
}

export async function fetchPaySlipData(
  idSalaryWages: number,
  datePaySlip: string
) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  setAuthToken(token);
  const response = await api.get(
    `/api/SalariesAndWages/payment-slip/${idSalaryWages}/${datePaySlip}`
  );
  return response.data;
}

export async function registerVoucherByDocuments(values: {
  data: RegisterVoucherByDocuments;
  type: "c" | "d";
}) {
  const { data, type } = values;

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post(
    "/api/Voucher/RegisterVoucherByDocuments",
    data,
    {
      params: {
        type,
      },
    }
  );
  return response.data as RegisterVoucherByDocumentResponse;
}

export async function fetchBookBiggerDataByAccountCode(accountCode: string) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);

  const response = await api.get(
    `/api/Report/BookBiggerData/ByAccountCode/${accountCode}`
  );
  return response.data as BookBiggerData[];
}

export async function fetchDiaryBookData(
  InitDate: string,
  EndDate: string,
  inSus: boolean
) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);

  const response = await api.get(`/api/Report/diarybook`, {
    params: {
      InitDate,
      EndDate,
      inSus,
    },
  });
  return response.data as DiaryBookResponse;
}

//REPORT
//XlslData / ${reporte}
type PathReport = "balanceGeneral" | "balanceDeSumas" | "estadoDeResultado";
export async function getAllDataReportByType({
  iDate,
  eDate,
  typePath,
  level,
}: {
  iDate: string;
  eDate: string;
  typePath: PathReport;
  level?: LevelData;
}) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);

  const response = await api.get(`/api/Report/XlxsData/${typePath}`, {
    params: {
      InitDate: iDate,
      EndDate: eDate,
      Level: level,
    },
  });
  return response.data;
}

export async function generateDiaryBookExcel(InitDate: string,
  endDate: string,
  inSus: boolean,) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);

  const response = await api.get(`/api/Report/BookDiaryBookExel`, {
    responseType: "text",
    params: {
      InitDate,
      endDate,
      inSus,
    }
  });
  return response.data as string;
}

export async function synchronizeAccounts() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);

  const response = await api.post(`/api/Voucher/Syncronize`);
  return response.data;
}


// export async function fetchHeritageEvaluationData(
//   initDate: string,
//   endDate: string,
//   inSus: boolean,
//   type: "1"
// ): Promise<string>; 
// export async function fetchHeritageEvaluationData(
//   initDate: string,
//   endDate: string,
//   inSus: boolean,
//   type: "2"
// ): Promise<HeritageEvaluationData>;
export async function fetchHeritageEvaluationData(initDate: string, endDate: string, inSus:boolean, type: "1" | "2"){
  // 1: XLSX, 2: DATA
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);

  const response = await api.get(`/api/FinancialState/HeritageEvaluation`, {
    params:{
      InitDate: initDate,
      EndDate: endDate,
      InSus: inSus,
      Type: type,
    }
  });

  if(type === "1"){
    return response.data as string;//excel link
  }else{
    return response.data as HeritageEvaluationData;
  }
}

export async function fetchContableNotesBlob(){
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);

  const response = await api.get(`/api/Report/ContableNotes`, {
    responseType: "blob",
  })

  return response.data
}

export async function postAllSubDatas(data: SendAllSubDatas){
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);

  const response = await api.post(`/api/Voucher/RegisterVoucherByDocumentsInvert`, data, 
    {
      params: {
        type: "t"// esto no requiere ser un argumento en la funcion ya que nunca cambiara
      }
    }
  )

  return response.data as RegisterVoucherByDocumentResponse;
}