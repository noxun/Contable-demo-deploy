// features/vouchers/hooks/useVouchers.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchVouchers } from "../services/voucherService";
import { VoucherType } from "../../shared/types/sharedTypes";

export function useVouchers({
  voucherType,
  page,
  pageSize = 10,
  initDate,
  endDate,
  gloss = "",
  siat = "",
  glossSuffix = "",
}: {
  voucherType: VoucherType;
  page: number;
  pageSize?: number;
  initDate?: string;
  endDate?: string;
  gloss?: string;
  siat?: "" | "siat";
  glossSuffix?: string;
}) {
  return useQuery({
    queryKey: [
      "Vouchers",
      voucherType,
      page,
      pageSize,
      initDate,
      endDate,
      gloss + glossSuffix,
      siat,
    ],
    queryFn: () =>
      fetchVouchers(
        voucherType,
        page,
        pageSize,
        initDate,
        endDate,
        gloss + glossSuffix,
        siat
      ),
    placeholderData: keepPreviousData,
  });
}
