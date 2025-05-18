"use client"

import { generatePayroll } from "@/lib/trazo-data"
import { useQuery } from "@tanstack/react-query"

export default function usePayrollData(procedureId: number, isEnabled: boolean = false) {
  return useQuery({
    queryKey: ["payroll"],
    queryFn: () => generatePayroll(procedureId),
    enabled: isEnabled,
  })
}
