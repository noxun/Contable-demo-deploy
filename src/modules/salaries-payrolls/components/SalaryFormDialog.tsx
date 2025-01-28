import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { FormSalary } from "./FormSalary";

interface Props {
  idPayroll: string
  buttonElement?: JSX.Element
}

export const SalaryFormDialog = ({ idPayroll, buttonElement }: Props) => {

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {buttonElement || <Button>Crear Registro</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Registro</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <FormSalary idPayroll={idPayroll} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}