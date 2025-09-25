import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateOrUpdateSaleForm } from "./CreateOrUpdateSaleForm";
import { Sale } from "../schemas/saleSchema";
import { Button } from "@/components/ui/button";

type Props = {
  mode: "create" | "update";
  sale?: Sale;
};

export function DialogCreateOrUpdateSaleForm({ mode, sale }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          {mode === "create" ? "Crear Venta" : "Actualizar Venta"}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90%] overflow-y-auto h-[90%]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Crear Venta" : "Actualizar Venta"}
          </DialogTitle>
          <DialogDescription>
            Formulario para {mode === "create" ? "crear" : "actualizar"} una
            venta.
          </DialogDescription>
        </DialogHeader>
        <CreateOrUpdateSaleForm mode={mode} sale={sale}/>
      </DialogContent>
    </Dialog>
  );
}
