// import { api } from "@/lib/api";
// import { VoucherDeleteVariables } from "../../shared/components/DeleteVoucherDialog";
// import { Voucher } from "../../shared/types/sharedTypes";

// export async function fetchVouchers(
//   voucherType: string,
//   page: number = 1,
//   pageSize: number = 10,
//   initDate?: string,
//   endDate?: string,
//   gloss?: string,
//   siat: "" | "siat" = ""
// ) {
//   const response = await api.get(`/api/Voucher/all${siat}`, {
//     params: {
//       type: voucherType,
//       PageNumber: page,
//       PageSize: pageSize,
//       initDate,
//       endDate,
//       gloss: gloss !== "" ? gloss : undefined,
//     },
//   });

//   const paginationHeader = response.headers;
//   const paginationInfo = paginationHeader
//     ? JSON.parse(paginationHeader["pagination"])
//     : null;

//   return {
//     data: response.data as Voucher[],
//     pagination: paginationInfo,
//   };
// }

// export async function editVoucher(data: Voucher) {
//   const response = await api.put(`/api/Voucher`, data);
//   return response.data;
// }

// export async function deleteVoucher({
//   voucherId,
//   voucherType,
// }: VoucherDeleteVariables) {
//   const response = await api.delete("/api/Voucher", {
//     params: {
//       id: voucherId,
//       type: voucherType,
//     },
//   });
//   return response.data;
// }
