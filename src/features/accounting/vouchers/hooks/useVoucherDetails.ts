import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchSingleVoucherDetails } from "../services/voucherService";

export function useVoucherDetails(
  id: number | undefined,
  type: string | undefined,
  isEnabled = true
) {
  return useQuery(voucherDetailsQueryOptions(id, type, isEnabled));
}

export function voucherDetailsQueryOptions(
  id: number | undefined,
  type: string | undefined,
  isEnabled = true
) {
  return queryOptions({
    queryKey: ["Vouchers", id, type],
    queryFn: () => {
      if (!id || !type) {
        throw new Error("El id y el tipo del voucher son necesarios");
      }
      return fetchSingleVoucherDetails(id, type);
    },
    enabled: isEnabled && !!id && !!type,
  });
}
