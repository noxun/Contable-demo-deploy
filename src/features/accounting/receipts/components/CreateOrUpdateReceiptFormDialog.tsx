"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateOrUpdateReceiptForm } from "./CreateOrUpdateReceiptForm";
import { Receipt } from "../schemas/receiptSchema";
import { useState } from "react";

interface CreateOrUpdateReceiptFormDialogProps {
  receipt?: Receipt;
  mode: "create" | "edit";
}

export function CreateOrUpdateReceiptFormDialog({
  receipt,
  mode,
}: CreateOrUpdateReceiptFormDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar Recibo" : "Crear Nuevo Recibo"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modifica los datos del recibo. Haz clic en guardar cuando hayas terminado."
              : "Completa los datos para crear un nuevo recibo. Todos los campos marcados son obligatorios."}
          </DialogDescription>
        </DialogHeader>
        <CreateOrUpdateReceiptForm
          mode={mode}
          receipt={receipt}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
