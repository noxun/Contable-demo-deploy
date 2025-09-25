import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saleService } from "../services/saleService";
import { toast } from "sonner";
import { salesQueryConfig } from "./useSales";

export function useGenerateSaleSeats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saleService.generateSaleSeats,
    onSuccess: () => {
      toast.success("Asientos de ventas generados exitosamente");
      queryClient.invalidateQueries(salesQueryConfig());
    },
    onError: (error) => {
      console.error("Error generating sale seats:", error);
      toast.error("Error al generar los asientos de ventas");
    },
  });
}
