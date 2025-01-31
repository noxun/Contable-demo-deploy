"use client";

import { fetchDiaryBookData } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useDiaryBookData(
  InitDate: string,
  EndDate: string,
  inSus: boolean,
  isEnabled: boolean
) {
  return useQuery({
    queryKey: ["DiaryBookData", InitDate, EndDate, inSus],
    queryFn: () => fetchDiaryBookData(InitDate, EndDate, inSus),
    enabled: isEnabled,
  });
}
