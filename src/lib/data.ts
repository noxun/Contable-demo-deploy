import {
  AccountRelation,
  ModelSeat,
  ModelSeatDetailResponse,
  PostModelSeat,
  SiatMotionAccount,
  TypeCompany,
  Ufv,
} from "./types";
import { api } from "./api";
import { UfvRegister } from "@/modules/ufv/components/UfvRegisterForm";
import { Voucher, VoucherType } from "@/modules/shared/types/sharedTypes";
import { LinkAccountForm } from "@/modules/link/components/LinkAccountForm";
import { Account } from "@/modules/account/types/account";

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
