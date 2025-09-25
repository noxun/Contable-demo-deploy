import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateOrUpdatePurchaseForm } from "./CreateOrUpdatePurchaseForm";
import { Purchase } from "../schemas/purchaseSchema";
import { Button } from "@/components/ui/button";

type Props = {
  mode: "create" | "update";
  purchase?: Purchase;
};

export function DialogCreateOrUpdatePurchaseForm({ mode, purchase }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          {mode === "create" ? "Crear Compra" : "Actualizar Compra"}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90%] overflow-y-auto h-[90%]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Crear Compra" : "Actualizar Compra"}
          </DialogTitle>
          <DialogDescription>
            Formulario para {mode === "create" ? "crear" : "actualizar"} una
            compra.
          </DialogDescription>
        </DialogHeader>
        <CreateOrUpdatePurchaseForm mode={mode} purchase={purchase}/>
      </DialogContent>
    </Dialog>
  );
}
