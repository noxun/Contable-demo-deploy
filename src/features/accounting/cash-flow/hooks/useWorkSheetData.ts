import { queryOptions, useQuery } from "@tanstack/react-query";
import { getWorkSheetCashFlowData } from "../services/service";

export function useWorkSheetData() {
  return useQuery(useWorkSheetDataQueryOptions())
}

export function useWorkSheetDataQueryOptions() {
  return queryOptions({
    queryKey: ["WorkSheetData"],
    queryFn: getWorkSheetCashFlowData,
  })
}