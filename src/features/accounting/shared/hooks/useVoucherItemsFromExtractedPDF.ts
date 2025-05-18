"use client";

import { fetchVoucherItemsFromExtractedPDF } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useVoucherItemsFromExtractedPDF(
  bankExtractId: number,
  isEnabled = false
) {
  return useQuery({
    queryKey: ["voucherItemsFromExtractedPDF", bankExtractId],
    queryFn: () => fetchVoucherItemsFromExtractedPDF(bankExtractId),
    enabled: isEnabled,
  });
}
