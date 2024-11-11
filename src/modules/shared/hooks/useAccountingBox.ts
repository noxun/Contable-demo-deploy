import { fetchAccountingBox } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useAccountingBox() {
  return useQuery({
    queryKey: ["accountingBox"],
    queryFn: fetchAccountingBox,
  });
}
