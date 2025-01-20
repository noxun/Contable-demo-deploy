"use client";

import { fetchPaySlipData } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function usePaySlipData(
  idSalaryWages: number,
  datePaySlip: string,
  isEnabled = false
) {
  return useQuery({
    queryKey: ["paySlipData", idSalaryWages, datePaySlip],
    queryFn: () => fetchPaySlipData(idSalaryWages, datePaySlip),
    enabled: isEnabled,
  });
}
