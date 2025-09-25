"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteModelSeat } from "@/lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export default function DeleteModelSeatDialog({
  modelSeatId,
}: {
  modelSeatId: number;
}) {
  const queryClient = useQueryClient();

  function handleClick() {
    deleteModelSeatMutation.mutate(modelSeatId);
  }

  const deleteModelSeatMutation = useMutation({
    mutationFn: deleteModelSeat,
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Hubo un error al eliminar el asiento modelo");
    },
    onSuccess: () => {
      toast.success("Asiento Modelo borrado correctamente");
      queryClient.invalidateQueries({ queryKey: ["AllModelSeats"] });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Esta Seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción borrara el modelo seleccionado y sus elementos
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
