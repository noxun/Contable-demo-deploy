import {
  useMutation,
  useQuery,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import { receiptService } from "../services/receiptService";
import { toast } from "sonner";

export function fetchReceiptsQueryOptions() {
  return queryOptions({
    queryKey: ["Receipts"],
    queryFn: receiptService.fetchReceipts,
  });
}

export function fetchReceiptQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["Receipts", id],
    queryFn: () => receiptService.fetchReceipt(id),
  });
}

export function useReceipts() {
  return useQuery(fetchReceiptsQueryOptions());
}

export function useReceipt(id: number) {
  return useQuery(fetchReceiptQueryOptions(id));
}

export function useCreateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: receiptService.createReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Receipts"] });
    },
  });
}

export function useUpdateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: receiptService.updateReceipt,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["Receipts"] });
      queryClient.invalidateQueries({ queryKey: ["Receipts", id] });
      toast.success("Recibo actualizado correctamente");
    },
  });
}

export function useDeleteReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: receiptService.deleteReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Receipts"] });
      toast.success("Recibo eliminado correctamente");
    },
    onError: (error) => {
      toast.error("Error al eliminar el recibo");
      console.error("Error deleting receipt:", error);
    },
  });
}
