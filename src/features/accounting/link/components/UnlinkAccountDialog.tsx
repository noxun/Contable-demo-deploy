"use client";
import { Button } from "@/components/ui/button";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConciliation } from "@/lib/data";
import { toast } from "sonner";
type UnlinkAccountDialogProps = {
  accountId: number;
  siatAccountId: number;
};

export default function UnlinkAccountDialog({
  accountId,
  siatAccountId,
}: UnlinkAccountDialogProps) {
  const queryClient = useQueryClient();

  const unlinkAccountMutation = useMutation({
    mutationFn: deleteConciliation,
    onError: (error) => {
      toast.error("Hubo un error al desvincular");
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllAccountRelation"] });
      toast.success("Cuentas desvinculadas correctamente");
    },
  });

  function handleClick() {
    const data = {
      accountId,
      accountRef: siatAccountId,
    }
    unlinkAccountMutation.mutate(data);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Desvincular</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Esta seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion desvinculara ambas cuentas
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
