import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GetSalariesById } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { FilePenLineIcon } from "lucide-react";
import { useState } from "react";
import { FormSalary } from "./FormSalary";

interface Props {
  idItem: string
  buttonElement?: JSX.Element
}

export const SalaryDialogEdit = ({ idItem, buttonElement }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: ItemSelected, refetch: refetchPayment, isRefetching } = useQuery({
    queryKey: ['SalaryEdit'],
    queryFn: () => {
      return GetSalariesById({ id: idItem })
    },
    enabled: false
  })

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {
          buttonElement || (
            <Button
              variant="outline"
              className="size-10 p-2 text-blue-500 rounded-full"
              aria-label="Actualizar"
              title="Actualizar"
              onClick={async () => await refetchPayment()}
            >
              <FilePenLineIcon />
            </Button>
          )
        }
      </DialogTrigger>
      {
        !isRefetching && idItem && (
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
        )
      }
    </Dialog>
  )
}