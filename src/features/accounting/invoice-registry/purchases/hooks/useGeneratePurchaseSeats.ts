import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchasesService } from "../services/purchasesService";
import { toast } from "sonner";

export function useGeneratePurchaseSeats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchasesService.generatePurchaseSeats,
    onSuccess: () => {
      toast.success("Asientos generados correctamente");
    },
    onError: (error) => {
      console.error("Error al generar asientos:", error);
      toast.error(`Error al generar asientos: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["PurchasesList"] });
      queryClient.invalidateQueries({ queryKey: ["Vouchers"], exact: false });
    },
  });
}
