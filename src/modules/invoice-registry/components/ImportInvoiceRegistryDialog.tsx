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
import Link from "next/link";

export default function ImportInvoiceRegistryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Importar desde Excel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar facturas al sistema</DialogTitle>
          <DialogDescription>
            Este formulario le permite importar facturas al sistema
          </DialogDescription>
        </DialogHeader>
        <Button asChild>
          <Link
            href="/files/plantilla_compras_ventas.xlsx"
            prefetch={false}
            download
          >
            Descargar Plantilla
          </Link>
        </Button>
        <ImportInvoiceRegistryForm />
      </DialogContent>
    </Dialog>
  );
}
