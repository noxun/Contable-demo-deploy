"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileSpreadsheet } from "lucide-react";
import ImportAccountForm from "./ImportAccountForm";

export default function ImportAccountDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <FileSpreadsheet className="mr-2 size-4" />
          Importar Cuentas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar las cuentas mediante Excel</DialogTitle>
          <DialogDescription>
            Este formulario le permite importar las cuentas desde un archivo Excel,
            tenga en cuenta que debe ser un formato especifico de archivo de otra forma
            no funcionara.
          </DialogDescription>
        </DialogHeader>
        <ImportAccountForm/>
      </DialogContent>
    </Dialog>
  );
}
