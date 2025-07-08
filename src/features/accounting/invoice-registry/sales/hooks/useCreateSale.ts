import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saleService } from "../services/saleService";
import { toast } from "sonner";
import { salesQueryConfig } from "./useSales";

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saleService.postSale,
    onSuccess: () => {
      toast.success("Venta creada exitosamente");
      queryClient.invalidateQueries(salesQueryConfig());
    },
    onError: (error) => {
      console.error("Error creating sale:", error);
      toast.error("Error al crear la venta");
    },
  });
}
