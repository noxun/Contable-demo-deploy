import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAPI } from "@user/lib/user";
import { toast } from "sonner";

export const useUpdateUser = (token: string, userId: number, onClose: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => updateUserAPI(userId, data, token),
    onSuccess: () => {
      toast.success("Usuario Editado");
      queryClient.invalidateQueries({ queryKey: ["User"] });
      queryClient.invalidateQueries({ queryKey: ["userRoles", userId] });
      onClose();
    },
    onError: (error: any) => {
      console.error("Error al editar usuario:", error.message);
      toast.error("Hubo un error al editar el usuario");
    },
  });
}