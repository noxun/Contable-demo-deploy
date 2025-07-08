import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saleService } from "../services/saleService";
import { toast } from "sonner";
import { salesQueryConfig } from "./useSales";

export function useApplySaleAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saleService.applySaleAccount,
    onSuccess: () => {
      toast.success("Asiento aplicado exitosamente");
      queryClient.invalidateQueries(salesQueryConfig());
    },
    onError: (error) => {
      console.error("Error applying sale account:", error);
      toast.error("Error al aplicar el asiento");
    },
  });
}
