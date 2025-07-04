import { queryOptions, useQuery } from "@tanstack/react-query";
import { purchasesService } from "../services/purchasesService";

export function purchasesQueryConfig() {
  return queryOptions({
    queryKey: ["PurchasesList"],
    queryFn: purchasesService.fetchPurchasesList,
  })
}

export function usePurchases() {
  return useQuery(purchasesQueryConfig())
}