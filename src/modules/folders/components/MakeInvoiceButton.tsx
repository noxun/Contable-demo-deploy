import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const MakeInvoiceButton = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button" variant="destructive">
          Enviar factura
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-center p-4 border-none">
        <div className="">
          <h4 className="font-semibold text-lg">Generar Factura</h4>
          <p className="mb-2">
            ¿Estas seguro que quieres enviar la factura se guardara en el SIN?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancelar</Button>
            <Button variant="default">Enviar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
