import { api } from "@/lib/api";
import {
  CreateVoucher,
  UpdateVoucher,
  Voucher,
  VoucherCreateResponse,
} from "../schemas/voucherSchema";

export async function fetchVouchers(
  voucherType: string,
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

  return {
    data: response.data as Voucher[],
    pagination: paginationInfo,
  };
}

export async function fetchSingleVoucherDetails(id: number, type: string) {
  const response = await api.get("/api/Voucher", {
    params: {
      id,
      type,
    },
  });

  return response.data as Voucher;
}

export async function createVoucher(data: CreateVoucher) {
  const response = await api.post("/api/Voucher", data);
  return response.data as VoucherCreateResponse
}

export async function updateVoucher(data: UpdateVoucher) {
  const response = await api.put(`/api/Voucher/${data.id}`, data);
  return response.data as Voucher;
}
