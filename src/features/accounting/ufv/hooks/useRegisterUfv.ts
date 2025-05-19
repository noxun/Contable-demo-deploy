import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { postUfvValues } from "../service/ufvService";
import useUserStore from "@/lib/userStore";

export function useRegisterUfv() {
  const { setUfvRegister } = useUserStore();

  return useMutation({
    mutationFn: postUfvValues,
    onError: (error) => {
      toast.error("Hubo un error al registrar los datos");
      console.log(error);
    },
    onSuccess: () => {
      setUfvRegister(true);
      toast.success("Valores Registrados correctamente!");
    },
  });
}
