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
        <Button className="my-2">Crear</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90%] h-auto">
        <DialogHeader >
          <DialogTitle className="text-center text-xl">Crear Nueva Caja</DialogTitle>
          <DialogDescription className="text-center">
            Este formulario permite crear una nueva caja
          </DialogDescription>
        </DialogHeader>
        <NewAccountingBoxForm />
      </DialogContent>
    </Dialog>
  );
}
