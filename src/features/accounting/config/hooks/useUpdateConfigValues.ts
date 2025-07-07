import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUfvValues } from "../../ufv/service/ufvService";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useUpdateConfigValues() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postUfvValues,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configValues"] });
      toast.success("Valores actualizados correctamente!");
    },
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Hubo un error al actualizar los valores");
    },
  });
}
