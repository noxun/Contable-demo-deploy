import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { purchasesService } from "../services/purchasesService";
import { useInvoiceFilters } from "../../hooks/useInvoiceFilters";

export function purchasesQueryConfig(
  applyVoucher?: boolean,
  orderByDesc?: boolean,
  initDate?: Date,
  endDate?: Date,
  pageNumber?: number,
  pageSize?: number
) {
  return queryOptions({
    queryKey: [
      "PurchasesList",
      applyVoucher,
      orderByDesc,
      initDate,
      endDate,
      pageNumber,
      pageSize,
    ],
    queryFn: () =>
      purchasesService.fetchPurchasesList(
        applyVoucher,
        orderByDesc,
        initDate,
        endDate,
        pageNumber,
        pageSize
      ),
    placeholderData: keepPreviousData,
  });
}

export function usePurchases() {
  const { filters } = useInvoiceFilters();
  return useQuery(
    purchasesQueryConfig(
      filters.applyVoucher,
      filters.orderByDesc,
      filters.initDate || undefined,
      filters.endDate || undefined,
      filters.pageNumber,
      filters.pageSize,
    )
  );
}
