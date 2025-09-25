import { postModelSeat } from "@/lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useCreateModelSeatMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postModelSeat,
    onSuccess: () => {
      toast.success("Asiento Modelo Creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["AllModelSeats"] });
      router.push(`/dashboard/accounting/model-seats`);
    },
    onError: (error) => {
      toast.error("Error al crear un asiento modelo");
      console.error(error);
    },
  });
}
