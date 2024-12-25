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
import { VoucherType } from "../types/sharedTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteVoucher } from "@/lib/data";

type DeleteVoucherDialogProps = {
  voucherId: number;
  voucherType: VoucherType;
};

export type VoucherDeleteVariables = DeleteVoucherDialogProps;

export default function DeleteVoucherDialog({
  voucherId,
  voucherType,
}: DeleteVoucherDialogProps) {
  const queryClient = useQueryClient();
  const voucherDeleteMutation = useMutation({
    mutationFn: deleteVoucher,
    onSuccess: () => {
      toast.success("Voucher borrado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["Vouchers"], exact: false });
    },
    onError: (error: AxiosError) => {
      toast.error("Error al borrar el Voucher");
      console.log(error);
    },
  });

  function handleClick(){
    voucherDeleteMutation.mutate({voucherId,voucherType})
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Esta Absolutamente Seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no puede revertirse. Esto borrara permanentemente el
            voucher con id: {voucherId}
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
