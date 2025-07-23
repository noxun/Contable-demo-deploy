import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceRegistryService } from "../services/invoiceRegistryService";
import { toast } from "sonner";

export function useGenerateSingleSeat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoiceRegistryService.generateSingleSeat,
    onSuccess: () => {
      toast.success("Asiento generado correctamente");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Error al generar el asiento"
      );
    },
    onSettled: (_data, _error, variables) => {
      const { type } = variables;

      if (type === "sale") {
        queryClient.invalidateQueries({
          queryKey: ["SalesList"],
        });
      } else if (type === "buy") {
        queryClient.invalidateQueries({
          queryKey: ["PurchasesList"],
          exact: false,
        });
      }
    },
  });
}
