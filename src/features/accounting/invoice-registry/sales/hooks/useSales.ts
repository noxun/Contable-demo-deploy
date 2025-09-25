import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { saleService } from "../services/saleService";
import { useInvoiceFilters } from "../../hooks/useInvoiceFilters";

export function salesQueryConfig(
  applyVoucher?: boolean,
  orderByDesc?: boolean,
  initDate?: Date,
  endDate?: Date,
  pageNumber?: number,
  pageSize?: number
) {
  return queryOptions({
    queryKey: [
      "SalesList",
      applyVoucher,
      orderByDesc,
      initDate,
      endDate,
      pageNumber,
      pageSize,
    ],
    queryFn: () =>
      saleService.fetchSalesList(
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

export function useSales() {
  const { filters } = useInvoiceFilters();
  return useQuery(
    salesQueryConfig(
      filters.applyVoucher,
      filters.orderByDesc,
      filters.initDate || undefined,
      filters.endDate || undefined,
      filters.pageNumber,
      filters.pageSize,
    )
  );
}
