import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saleService } from "../services/saleService";
import { toast } from "sonner";
import { salesQueryConfig } from "./useSales";

export function useUpdateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saleService.updateSale,
    onSuccess: () => {
      toast.success("Venta actualizada exitosamente");
      queryClient.invalidateQueries(salesQueryConfig());
    },
    onError: (error) => {
      console.error("Error updating sale:", error);
      toast.error("Error al actualizar la venta");
    },
  });
}
