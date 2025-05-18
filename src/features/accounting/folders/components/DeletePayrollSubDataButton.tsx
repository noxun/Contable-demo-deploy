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
import { deleteSubData } from "@/lib/trazo-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DeletePayrollSubDataButton({
  procedureId,
  subDataId,
}: {
  procedureId: number;
  subDataId: number;
}) {
  const queryClient = useQueryClient();

  const deletePayrollSubDataMutation = useMutation({
    mutationFn: deleteSubData,
    onSuccess: () => {
      toast.success("Registro eliminado correctamente");
      queryClient.invalidateQueries({queryKey: ["procedureDataset", procedureId]});
    },
    onError: (error: AxiosError) => {
      toast.error("Hubo un error al eliminar el registro");
      console.log(error);
    },
  });

  const handleClick = () => {
    console.log("Deleting subData with id: ", subDataId);
    deletePayrollSubDataMutation.mutate(subDataId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Estas seguro de eliminar este registro?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion no se puede deshacer
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
