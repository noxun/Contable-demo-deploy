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
import { deleteInvoiceRegistryById } from "@/lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function InvoiceRegistryDeleteButton({invoiceRegistryId}:{invoiceRegistryId: number}) {

  const queryClient = useQueryClient()
  const router = useRouter();

  const deleteInvoiceRegistryMutation = useMutation({
    mutationFn: deleteInvoiceRegistryById,
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Hubo un error al eliminar el registro");
    },
    onSuccess: () => {
      toast.success("Extracto borrado correctamente");
      queryClient.invalidateQueries({queryKey:["invoiceRegistry"]})
      router.push("/dashboard/accounting/invoice-registry");
    },
  });

  function handleClick() {
    deleteInvoiceRegistryMutation.mutate(invoiceRegistryId)
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
            Esta acción borrara permanentemente el registro seleccionado
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
