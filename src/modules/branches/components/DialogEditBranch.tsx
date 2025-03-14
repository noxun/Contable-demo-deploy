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
import { useState } from "react";
import FormEditBranch from "./FormEditBranch";
import { Branch } from "@/lib/types";

type DialogEditBranchProps = { branch: Branch };

export default function DialogEditBranch({ branch }: DialogEditBranchProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Sucursal</DialogTitle>
          <DialogDescription>
            Aquí puedes editar la información de la sucursal
          </DialogDescription>
        </DialogHeader>
        <FormEditBranch branch={branch} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
