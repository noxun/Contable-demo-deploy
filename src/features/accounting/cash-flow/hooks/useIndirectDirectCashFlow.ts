import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchIndirectCashFlow } from "../services/service";

export function useIndirectDirectCashFlow(isEnabled: boolean = true) {
  return useQuery(indirectCashFlowQueryOptions(isEnabled));
}

export function indirectCashFlowQueryOptions(isEnabled: boolean = true) {
  return queryOptions({
    queryKey: ["indirectCashFlow"],
    queryFn: fetchIndirectCashFlow,
    enabled: isEnabled,
  });
}
