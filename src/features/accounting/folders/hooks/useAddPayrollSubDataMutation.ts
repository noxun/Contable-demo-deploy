import { postSubData } from "@/lib/trazo-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useAddPayrollSubDataMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSubData,
    onSuccess: (_, { procedureId }) => {
      toast.success("Campo agregado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["procedureDataset", procedureId],
      });
    },
    onError: (error: AxiosError) => {
      console.error(error);
      toast.error("Error al agregar el campo");
    },
  });
}
