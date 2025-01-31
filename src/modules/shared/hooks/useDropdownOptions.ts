import { fetchPayrollDropdownOptions } from "@/lib/trazo-data";
import { useQuery } from "@tanstack/react-query";

export default function useDropdownOptions(
  urlLabel:
    | "atributos"
    | "botrosgastos"
    | "cgastosdeoperaciones"
    | "dhonorariosProfesionales"
) {
  return useQuery({
    queryKey: ["payrollDropdownOptions", urlLabel],
    queryFn: () => fetchPayrollDropdownOptions(urlLabel),
  });
}
