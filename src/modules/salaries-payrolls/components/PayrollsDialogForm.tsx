import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormPayrolls } from "./FormPayrolls";
import { useState } from "react";


export const PayrollsDialogForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Crear</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nomina</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <FormPayrolls onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};