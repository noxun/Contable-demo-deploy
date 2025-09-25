"use client"

import { fetchProcedureDataset } from "@/lib/trazo-data"
import { useQuery } from "@tanstack/react-query"

export default function useProcedureDataset(procedureId: number, isEnabled: boolean = false) {
  return useQuery({
    queryKey: ["procedureDataset", procedureId],
    queryFn: () => fetchProcedureDataset(procedureId),
    enabled: isEnabled,
  })
}
