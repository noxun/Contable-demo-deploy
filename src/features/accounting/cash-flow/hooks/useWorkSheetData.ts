import { queryOptions, useQuery } from "@tanstack/react-query";
import { getWorkSheetCashFlowData } from "../services/service";

export function useWorkSheetData() {
  return useQuery(workSheetDataQueryOptions())
}

export function workSheetDataQueryOptions() {
  return queryOptions({
    queryKey: ["WorkSheetData"],
    queryFn: getWorkSheetCashFlowData,
  })
}