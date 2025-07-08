import { queryOptions, useQuery } from "@tanstack/react-query";
import { saleService } from "../services/saleService";

export function salesQueryConfig() {
  return queryOptions({
    queryKey: ["SalesList"],
    queryFn: saleService.fetchSalesList,
  })
}

export function useSales() {
  return useQuery(salesQueryConfig())
}
