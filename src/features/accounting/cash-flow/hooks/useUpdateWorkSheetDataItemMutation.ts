import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkSheetCashFlowDataItem } from "../services/service";
import { toast } from "sonner";

export function useUpdateWorkSheetDataItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkSheetCashFlowDataItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["WorkSheetData"] });
      toast.success("Hoja de trabajo actualizada correctamente");
    },
    onError: (error) => {
      console.error("Error al actualizar la hoja de trabajo:", error);
      toast.error("Error al actualizar la hoja de trabajo");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["WorkSheetData"] });
    },
  });
}
