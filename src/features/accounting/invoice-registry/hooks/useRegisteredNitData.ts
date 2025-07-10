import { queryOptions, useQuery } from "@tanstack/react-query";
import { invoiceRegistryService } from "../services/invoiceRegistryService";

export function registeredNitDataQueryOptions(filter: "byBuy" | "bySale") {
  return queryOptions({
    queryKey: ["registeredNitData", filter],
    queryFn: () => invoiceRegistryService.fetchCompanyNitData(filter),
  });
}

export function useRegisteredNitData(filter: "byBuy" | "bySale") {
  return useQuery(registeredNitDataQueryOptions(filter));
}
