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
import { deleteAllBankExtracts } from "@/lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type DeleteAllBankExtractsDialogProps = {
  bankId: number;
};

export default function DeleteAllBankExtractsDialog({
  bankId,
}: DeleteAllBankExtractsDialogProps) {
  const queryClient = useQueryClient();

  const deleteAllBankExtractsMutation = useMutation({
    mutationFn: deleteAllBankExtracts,
    onSuccess: () => {
      toast.success("Extractos borrados correctamente");
      queryClient.invalidateQueries({
        queryKey: ["bankExcerpt", bankId],
      });
    },
    onError: (error: AxiosError) => {
      toast.error("Error al borrar los extractos");
      console.error(error);
    },
  });

  const handleClick = () => {
    deleteAllBankExtractsMutation.mutate(bankId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Borrar todos los extractos</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Esta absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción borrara todos los extractos de este banco.
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
