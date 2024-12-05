import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImportInvoiceRegistryForm from "./ImportInvoiceRegistryForm";

export default function ImportInvoiceRegistryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Importar desde Excel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar cuentas al sistema</DialogTitle>
          <DialogDescription>
            Este formulario le permite importar cuentas al sistema 
          </DialogDescription>
        </DialogHeader>
        {/* <ImportInvoiceRegistryForm /> */}
      </DialogContent>
    </Dialog>
  );
}
