"use client";

import { fetchBookBiggerDataByAccountCode } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useBiggerBookDataByAccountCode(
  accountCode: string,
  isEnabled = false
) {
  return useQuery({
    queryKey: ["biggerBookDataByAccountCode", accountCode],
    queryFn: () => fetchBookBiggerDataByAccountCode(accountCode),
    enabled: isEnabled,
  });
}
