"use client";

import { fetchBankExtractFiles } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useBankExtractPaymentFilesById(bankExtractId: number) {
  return useQuery({
    queryKey: ["bankExtractPaymentFiles", bankExtractId],
    queryFn: () => fetchBankExtractFiles(bankExtractId),
  });
}
