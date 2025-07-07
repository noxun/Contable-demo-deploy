import {
  AccountingBox,
  AccountingBoxBalance,
  AccountingBoxItems,
  AccountRelation,
  Bank,
  BankExcerpt,
  BankExcerptResponse,
  BankExtractPaymentFile,
  BookBiggerData,
  Branch,
  BranchToList,
  BudgetExecutionData,
  BudgetExecutionResponse,
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
  RelationAccount,
  Role,
  RoleMenu,
  SalariesAndWagesAccounts,
  SalaryAndWageAccount,
  SendAllSubDatas,
  SiatMotionAccount,
  TrazoCompany,
  TrazoInternCode,
  TypeCompany,
  Ufv,
  VoucherItemFromExtractedPDF,
} from "./types";
import { api } from "./api";
import {
  Voucher,
  VoucherType,
} from "@/features/accounting/shared/types/sharedTypes";
import { LinkAccountForm } from "@/features/accounting/link/components/LinkAccountForm";
import { Account } from "@/features/accounting/account/types/account";
import { NewAccountingBox } from "@/features/accounting/accounting-box/components/NewAccountingBoxForm";
import { RegisterForm } from "@/app/dashboard/accounting/users/new/page";
import { EditModelSeat } from "@/features/accounting/model-seats/components/FormEditModelSeat";
import { VoucherDeleteVariables } from "@/features/accounting/shared/components/DeleteVoucherDialog";
import {
  FixedAsset,
  FixedAssetsAll,
  SchemaFixedAsset,
} from "@/features/accounting/fixed-assets/types/types";
import {
  ItemPayment,
  Payroll,
  ResponsePayrolls,
  ResponseSalariesAndPayrolls,
  Salaries,
  SchemaPayrollType,
  SchemaSalaryType,
} from "@/features/accounting/salaries-payrolls/types/types";
import { RegisterVoucherByDocuments } from "./trazoTypes";
import { LevelData } from "@/features/accounting/results/types/types";
import { BranchEditForm } from "@/features/accounting/branches/components/FormEditBranch";


export async function fetchVouchers(
  voucherType: VoucherType,
  page: number = 1,
  pageSize: number = 10,
  initDate?: string,
  endDate?: string,
  gloss?: string,
  siat: "" | "siat" = ""
) {
  const response = await api.get(`/api/Voucher/all${siat}`, {
    params: {
      type: voucherType,
      PageNumber: page,
      PageSize: pageSize,
      initDate,
      endDate,
      gloss: gloss !== "" ? gloss : undefined,
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
  const response = await api.put(`/api/Voucher`, data);
  return response.data;
}

export async function deleteVoucher({
  voucherId,
  voucherType,
}: VoucherDeleteVariables) {
  const response = await api.delete("/api/Voucher", {
    params: {
      id: voucherId,
      type: voucherType,
    },
  });
  return response.data;
}

export async function fetchAllMotionAccountsWithRelations() {
  const response = await api.get(`/api/Account/Relations`);
  return response.data as RelationAccount[];
}

export async function fetchAllSiatMotionAccounts() {
  const response = await api.get(`/api/Account/SiatMotion`);
  return response.data as SiatMotionAccount[];
}

export async function postConciliation(data: LinkAccountForm) {
  const response = await api.post(`/api/Conciliation`, data);
  return response.data;
}

export async function deleteConciliation(data: LinkAccountForm) {
  //cambiar esto para que reciba ya sea paths o queryStrings
  const response = await api.delete(`/api/Conciliation`, { data: data });
  return response.data;
}

export async function fetchAllModelSeats(type: number | null = null) {
  const response = await api.get(`/api/ModelSeat`, {
    params: {
      Type: type,
    },
  });
  return response.data as ModelSeat[];
}

export async function deleteModelSeat(modelSeatId: number) {
  const response = await api.delete("api/ModelSeat", {
    params: {
      modelSeatId,
    },
  });
  return response.data;
}

export async function fetchAllMotionAccounts() {
  const response = await api.get(`/api/Account/Filter`, {
    params: {
      isMotion: true,
    },
  });
  return response.data as Account[];
}

export async function postModelSeat(data: PostModelSeat) {
  const response = await api.post("/api/ModelSeat", data);
  return response.data;
}

export async function fetchModelSeatsItems(modelSeatId: string) {
  const response = await api.get(`/api/ModelSeat/detail`, {
    params: {
      modelSeatId: modelSeatId,
    },
  });
  return response.data as ModelSeatDetailResponse;
}

export async function putModelSeat(data: EditModelSeat) {
  const response = await api.put("/api/ModelSeat", data);
  return response.data;
}

export async function fetchTypeCompanies() {
  const response = await api.get(`/api/TypeCompany`);
  return response.data as TypeCompany[];
}

export async function importAccountFromExcel(data: FormData) {
  const response = await api.post(`/api/Account/ReadXlxs`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function importBankExcerptFromExcel(data: FormData) {
  const response = await api.post(`/api/bank/extract`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function fetchAccountingBox(): Promise<AccountingBox[]> {
  const response = await api.get(`/api/AccountingBox`);
  return response.data as AccountingBox[];
}

export async function fetchCostCenterByRoleData(
  data: Role[]
): Promise<CostCenter[]> {
  const response = await api.post(`/api/CostCenter`, data);
  return response.data as CostCenter[];
}

export async function fetchAllCostCenter(): Promise<CostCenter[]> {
  const response = await api.get(`/api/CostCenter`);
  return response.data as CostCenter[];
}

export async function fetchBranches() {
  const response = await api.get(`/api/Sucursal`);
  return response.data as Branch[];
}

export async function createNewBranch(data: Branch) {
  const response = await api.post(`/api/Sucursal`, data);
  return response.data;
}

export async function updateBranch(data: BranchEditForm) {
  const response = await api.put(`/api/Sucursal`, data);
  return response.data;
}

export async function fetchAllRoles() {
  const response = await api.get(`/api/Rol`);
  return response.data as RoleMenu[];
}

export async function fetchUserRoles(userId: number) {
  const response = await api.get(`/api/Users/getRol/${userId}`);
  return response.data as Role[];
}

export async function fetchBankExcerpt(
  bankId: string,
  page: number,
  pageSize: number
) {
  const response = await api.get(`/api/bank/getextract/${bankId}`, {
    params: {
      pageNumber: page,
      pageSize: pageSize,
    },
  });
  return response.data as BankExcerptResponse;
}

// export async function fetchBankExcerptData(bankExcerptId: string) {
//   if (typeof window !== "undefined") {
//     token = localStorage.getItem("token");
//   }
//   const response = await api.get(`/api/bank/getextractDetail/${bankExcerptId}`);
//   return response.data as BankExcerptData[];
// }

export async function fetchBranchList() {
  const response = await api.get(`/api/Sucursal/list`);
  return response.data as BranchToList[];
}

export async function registerExtractToSeat(data: {
  type: string;
  bankExtractId: number;
  accountId: number; //accountId de contra cuenta
}) {
  const response = await api.post("/api/Bank/registerSeat", data);
  return response.data;
}

export async function registerToTrazo(bankExtractId: number) {
  const response = await api.post("/api/Bank/registerTrazo", {
    bankExtractId,
  });
  return response.data;
}

export async function fetchAllAccounts() {
  const response = await api.get("/api/Account/Filter?isMotion=true");
  return response.data as Account[];
}

export async function fetchAccountsByType(type: number) {
  const response = await api.get("/api/Account/All", {
    params: {
      typeCompanyId: type,
    },
  });
  return response.data as Account[];
}

export async function fetchTrazoInternCodes(
  page = 1,
  pageSize = 10,
  searchQuery: string
) {
  const response = await api.get("/api/Trazo/interncode", {
    params: {
      PageNumber: page,
      PageSize: pageSize,
      codeIntern: searchQuery,
    },
  });
  console.log(response);

  const paginationHeader = response.headers;
  const paginationInfo = paginationHeader
    ? JSON.parse(paginationHeader["pagination"])
    : null;

  console.log("what", paginationInfo);

  return {
    data: response.data as TrazoInternCode[],
    pagination: paginationInfo,
  };
}

export async function fetchTrazoInternCodesByCompanyId(companyId: number) {
  const response = await api.get(
    `/api/Trazo/interncodes/companies/${companyId}`
  );
  return response.data as TrazoInternCode[];
}

export async function fetchTrazoCompanies() {
  const response = await api.get("/api/Trazo/companies");
  return response.data as TrazoCompany[];
}

export async function postCompanyOrConcept(data: { name: string }) {
  const response = await api.post("/api/Company", data);
  return response.data as {
    id: number;
    name: string;
    descripcion: any;
    sigla: any;
  };
}

export async function fetchAccountingBoxItemsById(accountingBoxId: number) {
  const response = await api.get("/api/AccountingBox/items", {
    params: {
      AccountingBoxId: accountingBoxId,
    },
  });
  return response.data as AccountingBoxItems[];
}

export async function createAccountingBoxItems(data: NewAccountingBox) {
  const response = await api.post("/api/AccountingBox/createItems", data);
  return response.data;
}

export async function getAccountingBoxBalance(accountingBoxId: number) {
  const response = await api.get(
    `/api/AccountingBox/balance/${accountingBoxId}`
  );
  return response.data as AccountingBoxBalance;
}

export async function fetchAllBanks() {
  const response = await api.get("/api/Bank");
  return response.data as Bank[];
}

export async function deleteBankExtract(bankExtractId: number) {
  const response = await api.delete(`/api/Bank/delete/${bankExtractId}`);
  return response.data;
}

export async function registerPayment(data: FormData) {
  const response = await api.post(`/api/Bank/RegisterPaymet`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function fetchBankExtractFiles(bankExtractId: number) {
  const response = await api.get(
    `/api/Bank/GetFilesBankExtract/${bankExtractId}`
  );
  return response.data as BankExtractPaymentFile[];
}

export async function changeBankExtractStatus(bankExtractId: number) {
  const response = await api.post(`/api/Bank/ChangeStatus/${bankExtractId}`);
  return response.data as boolean;
}

export async function registerUser(data: RegisterForm) {
  const response = await api.post("/Auth/register", data);
  return response.data;
}

export async function fetchBankExtractAccountDetails(
  BankExtractId: number,
  AccountId: number
) {
  const response = await api.get("/api/Bank/seatContable", {
    params: {
      BankExtractId,
      AccountId,
    },
  });
  return response.data;
}

export async function fetchInvoiceRegistryList() {
  const response = await api.get("/api/Invoice"); //TODO:ADD CORRECT ENDPOINT
  return response.data as InvoiceRegistry[];
}

// export async function postInvoiceRegistry(data: NewInvoiceForm) {
//   const response = await api.post(`/api/Invoice/`, data);
//   return response.data;
// }

export async function getMassPurchaseFormInExcel(type: InvoiceRegistryType) {
  const response = await api.get(`/GenerateInvoice/${type}`, {
    responseType: "text",
  });
  return response.data as string;
}

export async function getSingleAccountReport(data: any) {
  const response = await api.post(`/api/report/printbook`, data, {
    responseType: "text",
  });
  return response.data as string;
}

export async function deleteInvoiceRegistryById(InvoiceRegistryId: number) {
  const response = await api.delete(`/api/Invoice/${InvoiceRegistryId}`);
  return response.data;
}

export async function fetchSingleInvoiceRegistryById(
  InvoiceRegistryId: number
) {
  const response = await api.get(`/api/Invoice/${InvoiceRegistryId}`);
  return response.data as InvoiceRegistry;
}

export async function editInvoiceRegistryById(data: InvoiceRegistry) {
  const response = await api.put(`/api/Invoice/${data.id}`, data);
  return response.data;
}

export async function importInvoiceRegistryExcel(data: FormData) {
  const numType = data.get("InvoiceRegistryType");

  data.delete("InvoiceRegistryType");

  const response = await api.post(`/exelInvoice/${numType}`, data);
  return response.data;
}

export async function fetchInvoiceRegistryByType(type: InvoiceRegistryType) {
  const response = await api.get(`/CompraVentaType/${type}`);
  return response.data as InvoiceRegistryResponseByType[];
}

export async function fetchInvoiceVoucherDetailsById(
  invoiceRegistryId: number
) {
  const response = await api.get(
    `api/invoice/SeatContable/${invoiceRegistryId}`
  );
  return response.data as InvoiceVoucher[];
}

export async function numberToLiteral(number: number, inSus: boolean = false) {
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
  level?: number;
}

export async function getApiReportExcel(
  path: string,
  queryParams: QueryParams,
  pathType?: string
) {
  const typePath = pathType ? `/${pathType}` : "";
  const URLRequest = `/api/Report/${path}${typePath}`;

  const response = await api.get(URLRequest, {
    params: queryParams,
  });
  return response.data;
}
//BIGGER BOOK
export async function searchByAccountBigguerBook(search: string) {
  const URLRequest = `/api/Report/BookBiggerData`;

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
  inSus = false,
  sucursalId,
}: {
  initDate?: string;
  endDate?: string;
  search?: string;
  inSus?: boolean;
  sucursalId?: string;
}) {
  const URLRequest = `/api/Report/BookBigguerDataExel`;

  const response = await api.get(URLRequest, {
    params: {
      initDate: initDate,
      endDate: endDate,
      search: search,
      sucursalId,
    },
  });
  return response.data;
}

//obtener el listado de activos
export interface Assets {
  id: number;
  typeActive: string;
}
export async function getAllAssets() {
  const URLRequest = `/FixedAssets/FixedAssets`;

  const { data } = await api.get<Assets[]>(URLRequest);
  return data;
}

//crear un nuevo activo Fijo
export async function postAssetFixed(FixedAsset: SchemaFixedAsset) {
  const URLRequest = `/FixedAssets`;

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
  const URLRequest = `/FixedAssets`;

  const { data } = await api.put(URLRequest, fixedAsset, {
    params: { IdAseets: IdAssets },
  });
  return data;
}

// obtener un activoFijo por Id
export async function getFixedAsset({ id }: { id: string }) {
  if (!id || id.length === 0) return null;

  const URLRequest = `/FixedAssets/items/${id}`;

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
  const URLRequest = `/FixedAssets`;

  const { data } = await api.get<FixedAssetsAll[]>(URLRequest, {
    params: { dateTime },
  });
  return data[0];
}

// eliminar un elemento de la lista de activos fijos
export async function deleteFixedAsset({ id }: { id: string }) {
  const URLRequest = `/FixedAssets?IdAssets=${id}`;

  const { data } = await api.delete(URLRequest, {
    params: {
      IdAseets: id,
    },
  });
  return data;
}

// GET; obtener el archivo excel de activos fijos
export async function getAllFixedAssetsExcelByDate({ date }: { date: string }) {
  const URLRequest = `/FixedAssets/FixedAssetsItems/exel`;

  const { data } = await api.get(URLRequest, {
    params: { date: date },
  });
  return data;
}

//Crear una banco apartir de una cuenta
export async function postConvertAccountToBank(accountId: string) {
  const URLRequest = `api/Bank/ByAccount/${accountId}`;

  const { data } = await api.post(URLRequest, accountId);
  return data;
}

//CRUD: Planillas --> Payrolls
//POST: Payrolls
export async function PostPayroll({ payroll }: { payroll: SchemaPayrollType }) {
  const URLRequest = `api/SalariesAndWages`;

  const { data } = await api.post(URLRequest, payroll);
  return data;
}
//GET: Payrolls
export async function GetPayrolls({ date }: { date: string }) {
  const URLRequest = `api/SalariesAndWages/itemsGeneral`;

  const { data } = await api.get<ResponsePayrolls>(URLRequest, {
    params: {
      date: date,
    },
  });
  return data;
}
//GET Payrolls and Salaries
export async function GetPayrollsAndSalaries({ date }: { date: string }) {
  const URLRequest = `/api/SalariesAndWages/itemsMonth`;

  const { data } = await api.get<ResponseSalariesAndPayrolls>(URLRequest, {
    params: {
      date: date,
    },
  });
  return data;
}
//GET By Id: Payrolls
export async function GetPayrollExcelByDate({ date }: { date: string }) {
  const URLRequest = `api/SalariesAndWages/itemsExel`;

  const { data } = await api.get(URLRequest, {
    params: {
      date: date,
    },
  });
  return data;
}
//GET By Id: Payrolls
export async function GetPayrollById({ id }: { id: string }) {
  const URLRequest = `api/SalariesAndWages/id`;

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
  const URLRequest = `api/SalariesAndWages/id`;

  const { data } = await api.put(URLRequest, payroll, {
    params: {
      id: id,
      IdItems: idItem,
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
  const URLRequest = `api/SalariesAndWages/items/IsPaid`;

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
  const URLRequest = `api/SalariesAndWages/id`;

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
  const URLRequest = `api/SalariesAndWages/items/id`;

  const { data } = await api.get<Payroll>(URLRequest, {
    params: {
      id: idPayroll,
    },
  });
  return data;
}
//GET: Items of Payrolls
export async function GetSalariesById({ id }: { id: string }) {
  const URLRequest = `api/SalariesAndWages/itemsDatos/id`;

  const { data } = await api.get<Salaries>(URLRequest, {
    params: {
      id: id,
    },
  });
  return data;
}
//POST: Items of Payrolls
export async function PostSalary({ Item }: { Item: SchemaSalaryType }) {
  const URLRequest = `api/SalariesAndWages/items`;

  const { data } = await api.post(URLRequest, Item);
  return data;
}
//DELETE: Items of Payrolls
export async function DeleteSalary({ id }: { id: string }) {
  const URLRequest = `api/SalariesAndWages/items/id`;

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
  const URLRequest = `api/SalariesAndWages/items/id`;

  const { data } = await api.put(URLRequest, item, {
    params: {
      id: id,
    },
  });
  return data;
}

//Crear una a caja apartir de una cuenta
export async function postConvertAccountToAccountingBox(accountId: string) {
  const URLRequest = `api/AccountingBox/ByAccount/${accountId}`;

  const { data } = await api.post(URLRequest, accountId);
  return data;
}

export async function fetchVoucherItemsFromExtractedPDF(bankExtractId: number) {
  const response = await api.get(`/api/Bank/Extract/Entries/${bankExtractId}`);
  return response.data as VoucherItemFromExtractedPDF[];
}

export async function fetchPaySlipData(
  idSalaryWages: number,
  datePaySlip: string
) {
  const response = await api.get(
    `/api/SalariesAndWages/payment-slip/${idSalaryWages}`,
    {
      params: {
        datePaySlip,
      },
    }
  );
  return response.data;
}

export async function registerVoucherByDocuments(values: {
  data: RegisterVoucherByDocuments;
  type: "c" | "d";
}) {
  const { data, type } = values;

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
  const response = await api.get(
    `/api/Report/BookBiggerData/ByAccountCode/${accountCode}`
  );
  return response.data as BookBiggerData[];
}

export async function fetchDiaryBookData(
  InitDate: string,
  EndDate: string,
  inSus: boolean,
  sucursalId?: string
) {
  const response = await api.get(`/api/Report/diarybook`, {
    params: {
      InitDate,
      EndDate,
      inSus,
      sucursalId,
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
  inSus = false,
  sucursalId,
}: {
  iDate: string;
  eDate: string;
  typePath: PathReport;
  level?: LevelData;
  inSus?: boolean;
  sucursalId?: string;
}) {
  const response = await api.get(`/api/Report/XlxsData/${typePath}`, {
    params: {
      InitDate: iDate,
      EndDate: eDate,
      Level: level,
      InSus: inSus,
      sucursalId,
    },
  });
  return response.data;
}

// 1 --> excel  2 --> data
export type TypeFetchBalance = 1 | 2;
export async function getAllDataBalanceGeneral({
  iDate,
  eDate,
  typeFetchBalance,
  level,
  inSus = false,
  sucursalId,
}: {
  iDate: string;
  eDate: string;
  typeFetchBalance: TypeFetchBalance;
  level?: LevelData;
  inSus?: boolean;
  sucursalId?: string;
}) {
  try {
    const response = await api.get(`/api/FinancialState/BalanceSheet`, {
      params: {
        Level: level,
        InitDate: iDate,
        EndDate: eDate,
        Type: typeFetchBalance,
        inSus,
        sucursalId,
      },
    });
    return response.data;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}

export async function getAllDataStatementIncome({
  iDate,
  eDate,
  typeFetchBalance,
  level,
  inSus = false,
  sucursalId,
}: {
  iDate: string;
  eDate: string;
  typeFetchBalance: TypeFetchBalance;
  level?: LevelData;
  inSus?: boolean;
  sucursalId?: string;
}) {
  try {
    const response = await api.get(`/api/FinancialState/StatementIncome`, {
      params: {
        Level: level,
        InitDate: iDate,
        EndDate: eDate,
        Type: typeFetchBalance,
        InSus: inSus,
        sucursalId,
      },
    });
    return response.data;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}


export async function getAllDataCashFlowTemporal({
  iDate,
  eDate,
  level,
  sucursalId,
}: {
  iDate: string;
  eDate: string;
  level?: LevelData;
  sucursalId?: string;
}) {
  const balanceGeneral = await getAllDataReportByType({
    eDate,
    iDate,
    typePath: "balanceGeneral",
    level,
    sucursalId,
  });
  const estadoResultados = await getAllDataReportByType({
    eDate,
    iDate,
    typePath: "estadoDeResultado",
    level,
    sucursalId,
  });
  console.log("tenemos los datos de: ", balanceGeneral, estadoResultados);
  return {
    balanceSheet: balanceGeneral,
    statementIncome: estadoResultados,
  };
}

export async function generateDiaryBookExcel(
  InitDate: string,
  endDate: string,
  inSus: boolean,
  sucursalId?: string
) {
  const response = await api.get(`/api/Report/BookDiaryBookExel`, {
    responseType: "text",
    params: {
      InitDate,
      endDate,
      inSus,
      sucursalId,
    },
  });
  return response.data as string;
}

export async function synchronizeAccounts() {
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
export async function fetchHeritageEvaluationData(
  initDate: string,
  endDate: string,
  inSus: boolean,
  type: "1" | "2"
) {
  // 1: XLSX, 2: DATA

  const response = await api.get(`/api/FinancialState/HeritageEvaluation`, {
    params: {
      InitDate: initDate,
      EndDate: endDate,
      InSus: inSus,
      Type: type,
    },
  });

  if (type === "1") {
    return response.data as string; //excel link
  } else {
    return response.data as HeritageEvaluationData;
  }
}

export async function fetchContableNotesBlob() {
  const response = await api.get(`/api/Report/ContableNotes`, {
    responseType: "blob",
  });

  return response.data;
}

export async function postAllSubDatas(data: SendAllSubDatas) {
  const response = await api.post(
    `/api/Voucher/RegisterVoucherByDocumentsInvert`,
    data,
    {
      params: {
        type: "t", // esto no requiere ser un argumento en la funcion ya que nunca cambiara
      },
    }
  );

  return response.data as RegisterVoucherByDocumentResponse;
}

export async function fetchSalariesAndWagesAccounts() {
  const response = await api.get(
    `/api/SalariesAndWages/accounts/salaries-to-pay`
  );

  return response.data as SalariesAndWagesAccounts;
}

export async function postSalariesAndWagesAccounts(name: string) {
  const response = await api.post(
    `/api/SalariesAndWages/accounts/salaries-to-pay`,
    name
  );
  //the name will be put in the account description
  //all other field will be filled by the backend
  return response.data as SalaryAndWageAccount;
}

export async function fetchBudgetExecutionData() {
  const response = await api.get(`/api/Budget`);

  return response.data as BudgetExecutionResponse;
}

export async function deleteAllBankExtracts(bankId: number) {
  const response = await api.delete(`/api/Bank/getextract/${bankId}`);

  return response.data;
}

export async function exportSingleAccountDataToExcel(params: {
  account: any;
  initDate: string;
  endDate: string;
  inSus: boolean;
}) {
  const { account, initDate, endDate, inSus } = params;

  const response = await api.post(
    `/api/Report/BookBigguerDataExelUnit`,
    account,
    {
      responseType: "text",
      params: {
        InitDate: initDate,
        endDate,
        inSus,
      },
    }
  );

  return response.data as string;
}
