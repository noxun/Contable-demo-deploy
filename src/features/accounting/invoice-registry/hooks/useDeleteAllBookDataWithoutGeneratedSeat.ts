import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceRegistryService } from "../services/invoiceRegistryService";
import { toast } from "sonner";

export function useDeleteAllBookDataWithoutGeneratedSeat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoiceRegistryService.deleteAllBookDataWithoutGeneratedSeats,
    onSuccess: () => {
      toast.success("Datos eliminados correctamente");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Error al eliminar los datos"
      );
    },
    onSettled: (_data, _error, variables) => {
      if (variables === "sale") {
        // Invalidate queries related to sales
        queryClient.invalidateQueries({
          queryKey: ["SalesList"],
        });
      } else if (variables === "buy") {
        // Invalidate queries related to purchases
        queryClient.invalidateQueries({
          queryKey: ["PurchasesList"],
          exact: false,
        });
      }
    },
  });
}
