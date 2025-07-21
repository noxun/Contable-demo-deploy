import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchDirectCashFlow } from "../services/service";

export function useDirectCashFlow() {
  return useQuery(directCashFlowQueryOptions());
}

export function directCashFlowQueryOptions() {
  return queryOptions({
    queryKey: ["directCashFlow"],
    queryFn: fetchDirectCashFlow,
  });
}
