import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewAccountingBoxForm from "./NewAccountingBoxForm";
import { useState } from "react";

// type NewAccountingBoxDialogProps = {
//   accountingBoxId: number
// }


export default function NewAccountingBoxDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="my-2">Crear</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90%] h-auto">
        <DialogHeader >
          <DialogTitle className="text-center text-xl">Crear Nuevo Item de Caja</DialogTitle>
          <DialogDescription className="text-center">
            Este formulario permite crear una nueva caja
          </DialogDescription>
        </DialogHeader>
        <NewAccountingBoxForm setOpen={setOpen}/>
      </DialogContent>
    </Dialog>
  );
}
