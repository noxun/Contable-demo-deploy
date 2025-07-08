import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ApplySaleAccountForm } from "./ApplySaleAccountForm";

type Props = {
  saleId: number;
  nit: string;
};

export function ApplySaleAccountDialog({ saleId, nit }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Aplicar Asiento</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar Asientos Contables</DialogTitle>
          <DialogDescription>
            Esta funcionalidad te permite aplicar un asiento contable a una
            venta específica. Asegúrate de seleccionar las cuentas correctas
            para el débito y el haber.
          </DialogDescription>
        </DialogHeader>
        <ApplySaleAccountForm saleId={saleId} nit={nit} />
      </DialogContent>
    </Dialog>
  );
}
