"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormCreateOrUpdateVoucher } from "./FormCreateOrUpdateVoucher";
import { CreateVoucher } from "../schemas/voucherSchema";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  mode: "create" | "update";
  defaultValues?: CreateVoucher;
  voucherId?: number;
  type?: string;
};

export default function DialogFormCreateOrUpdateVoucher({
  mode,
  defaultValues,
  voucherId,
  type,
}: Props) {
  const [open, setOpen] = useState(false);

  function handleOnSuccess() {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {mode === "create" ? "Crear Voucher" : "Actualizar Voucher"}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80%] h-[80%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Crear Voucher" : "Actualizar Voucher"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Complete los campos para crear un nuevo voucher."
              : "Actualice los campos necesarios para modificar el voucher existente."}
          </DialogDescription>
        </DialogHeader>
        <FormCreateOrUpdateVoucher
          mode={mode}
          defaultValues={defaultValues}
          voucherId={voucherId}
          type={type}
          onSuccess={handleOnSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
