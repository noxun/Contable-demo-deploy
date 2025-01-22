import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GetSalariesById } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { FilePenLineIcon } from "lucide-react";
import { useState } from "react";
import { FormSalary } from "./FormSalary";

interface Props {
  idItem: string
}

export const SalaryDialogEdit = ({ idItem }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: ItemSelected } = useQuery({
    queryKey: ['SalaryEdit', idItem],
    queryFn: () => {
      return GetSalariesById({ id: idItem })
    }
  })
  console.log('el vamos a editar es: ', ItemSelected)

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="size-10 p-2 text-blue-500 rounded-full"
          aria-label="Actualizar"
          title="Actualizar"
        >
          <FilePenLineIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Registro</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <FormSalary
          idPayroll={idItem}
          onClose={handleClose}
          itemForEdit={ItemSelected}
        />
      </DialogContent>
    </Dialog>
  )
}