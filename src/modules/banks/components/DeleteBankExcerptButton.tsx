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
import { deleteBankExtract } from "@/lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export default function DeleteBankExcerptButton({
  bankId,
  bankExtractId,
}: {
  bankId: string | number;// bankId para refrescar la query una vez borrado
  bankExtractId: number;
}) {

  const queryClient = useQueryClient()

  const deleteExcerptMutation = useMutation({
    mutationFn: deleteBankExtract,
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Hubo un error al eliminar el extracto");
    },
    onSuccess: () => {
      toast.success("Extracto borrado correctamente");
      queryClient.invalidateQueries({queryKey:["bankExcerpt", bankId]})
    },
  });

  function handleClick() {
    deleteExcerptMutation.mutate(bankExtractId)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Esta absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción borrara permanentemente el extracto seleccionado
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
