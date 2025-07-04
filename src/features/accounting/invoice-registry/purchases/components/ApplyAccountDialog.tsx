import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ApplyAccountForm } from "./ApplyAccountForm";

type Props = {
  purchaseId: number;
};

export function ApplyAccountDialog({ purchaseId }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Aplicar Asiento</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aplicar Asiento Contable</DialogTitle>
          <DialogDescription>
            Esta funcionalidad te permite aplicar un asiento contable a una
            compra específica. Asegúrate de seleccionar las cuentas correctas
            para el débito y el haber.
          </DialogDescription>
        </DialogHeader>
        <ApplyAccountForm purchaseId={purchaseId} />
      </DialogContent>
    </Dialog>
  );
}
