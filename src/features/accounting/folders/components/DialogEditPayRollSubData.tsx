"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditPayrollSubDataForm from "./EditPayrollSubDataForm";
import { SubData } from "@/lib/trazoTypes";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

type DialogEditPayRollSubDataProps = {
  subData: SubData;
  subDataId: number;
  procedureId: number;
  urlLabel:
    | "atributos"
    | "botrosgastos"
    | "cgastosdeoperaciones"
    | "dhonorariosProfesionales";
};

export default function DialogEditPayRollSubData({
  subData,
  subDataId,
  procedureId,
  urlLabel,
}: DialogEditPayRollSubDataProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal de Edicion</DialogTitle>
          <DialogDescription>Edita la subdata seleccionada</DialogDescription>
        </DialogHeader>
      <EditPayrollSubDataForm
        subDataId={subDataId}
        subData={subData}
        procedureId={procedureId}
        urlLabel={urlLabel}
      />
      </DialogContent>
    </Dialog>
  );
}
