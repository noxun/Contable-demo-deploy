import {
  AccountingBox,
  AccountRelation,
  BankExcerpt,
  BankExcerptData,
  Branch,
  BranchToList,
  CostCenter,
  ModelSeat,
  ModelSeatDetailResponse,
  PostModelSeat,
  Role,
  RoleMenu,
  SiatMotionAccount,
  TypeCompany,
  Ufv,
} from "./types";
import { api } from "./api";
import { UfvRegister } from "@/modules/ufv/components/UfvRegisterForm";
import { Voucher, VoucherType } from "@/modules/shared/types/sharedTypes";
import { LinkAccountForm } from "@/modules/link/components/LinkAccountForm";
import { Account } from "@/modules/account/types/account";
import axios from "axios";

function setAuthToken(token: string | undefined | null) {
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

export async function postUfvValues(data: UfvRegister) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.post(`/api/Ufv/registerUfvDollar`, data);
  return response.data;
}

export async function fetchVouchers(
  voucherType: VoucherType,
  page: number = 1,
  pageSize: number = 10
) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/Voucher/All`, {
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

export async function fetchAllModelSeats() {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  setAuthToken(token);
  const response = await api.get(`/api/ModelSeat`);
  return response.data as ModelSeat[];
}

export async function deleteModelSeat() {
  return; //WIP
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

// interface AccountingBox {
//   // Define aquí los campos específicos de AccountingBox
//   // Por ejemplo:
//   // id: number;
//   // name: string;
//   [key: string]: any; // Permite cualquier propiedad adicional
// }

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
