import { changeBankExtractStatus } from "@/lib/data";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useChangeBankExtractStatus() {
  return useMutation({
    mutationFn: changeBankExtractStatus,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Registrado correctamente");
    },
    onError: (error: AxiosError) => {
      toast.error("Error al registrar");
      console.log(error);
    },
  });
}
