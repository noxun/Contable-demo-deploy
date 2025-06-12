"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateOrUpdateReceiptForm } from "./CreateOrUpdateReceiptForm";
import { Receipt } from "../schemas/receiptSchema";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";

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
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          {mode === "edit" ? (
            <Pencil className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
        </Button>
      </DialogTrigger>
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
