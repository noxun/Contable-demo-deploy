import { putSubData } from "@/lib/trazo-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useEditPayrollSubDataMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putSubData,
    onSuccess: ({ id: procedureId }) => {
      toast.success("Campo editado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["procedureDataset", procedureId],
      });
    },
    onError: (error: AxiosError) => {
      console.error(error);
      toast.error("Error al editar el campo");
    },
  });
}
