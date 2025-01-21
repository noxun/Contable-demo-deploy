import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormPayrolls } from "./FormPayrolls";
import { useState } from "react";
import { FilePenLineIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetPayrollById } from "@/lib/data";

interface Props {
  idPayroll: string
}
export const PayrollsDialogEdit = ({ idPayroll }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: payrollSelected } = useQuery({
    queryKey: ['PayrollEdit', idPayroll],
    queryFn: () => {
      return GetPayrollById({ id: idPayroll })
    }
  })

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
          onClick={async () => {

          }}
          title="Actualizar"
        >
          <FilePenLineIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Nomina</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {
          payrollSelected && (
            <FormPayrolls
              onClose={handleClose}
              payroll={payrollSelected}
            />
          )
        }
      </DialogContent>
    </Dialog>
  );
};