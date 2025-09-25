import { fetchAllMotionAccounts } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useMotionAccounts() {
  return useQuery({
    queryKey: ["allMotionAccounts"],
    queryFn: fetchAllMotionAccounts,
  });
}
