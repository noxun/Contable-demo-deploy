import { fetchHeritageEvaluationData } from "@/lib/data";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useHeritageEvaluation(
  initDate: string,
  endDate: string,
  inSus: boolean,
  type: "1" | "2",
  isEnabled = true
) {
  return useQuery({
    queryKey: ["heritageEvaluation", initDate, endDate, inSus, type],
    queryFn: () => fetchHeritageEvaluationData(initDate, endDate, inSus, type),
    enabled: isEnabled && !!initDate && !!endDate,
    placeholderData: keepPreviousData,
  });
}
