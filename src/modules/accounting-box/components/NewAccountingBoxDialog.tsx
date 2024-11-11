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

export default function NewAccountingBoxDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Crear</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90%] h-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Caja</DialogTitle>
          <DialogDescription>
            Este formulario permite crear una nueva caja
          </DialogDescription>
        </DialogHeader>
        <NewAccountingBoxForm/>
      </DialogContent>
    </Dialog>
  );
}
