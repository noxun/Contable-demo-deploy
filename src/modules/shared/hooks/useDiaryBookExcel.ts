import { generateDiaryBookExcel } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useDiaryBookExcel(
  initDate: string,
  endDate: string,
  inSus: boolean,
  isEnabled: boolean
) {
  return useQuery({
    queryKey: ["DiaryBookExcel", initDate, endDate, inSus],
    queryFn: () => generateDiaryBookExcel(initDate, endDate, inSus),
    enabled: isEnabled,
  });
}
