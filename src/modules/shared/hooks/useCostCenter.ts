import { fetchCostCenter } from "@/lib/data";
import useUserStore from "@/lib/userStore";
import { useQuery } from "@tanstack/react-query";

export default function useCostCenter() {

  const loginData = useUserStore((state) => state.loginData);
  const filteredCostCenterClients = loginData?.rols.filter(
    (item) => !item.isMenu
  ) ?? [];

  return useQuery({
    queryKey: ["costCenter", filteredCostCenterClients],
    queryFn: () => fetchCostCenter(filteredCostCenterClients),
  });
}
