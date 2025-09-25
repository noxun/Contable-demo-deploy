import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormPayrolls } from "./FormPayrolls";
import { useState } from "react";
import { FilePenLineIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetPayrollById } from "@/lib/data";
import { ItemPayment } from "../types/types";

interface Props {
  idPayroll: string
  itemPayment: ItemPayment
}
export const PayrollsDialogEdit = ({ idPayroll, itemPayment }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: payrollSelected, refetch: refetchPayroll } = useQuery({
    queryKey: ['PayrollEdit'],
    queryFn: () => {
      return GetPayrollById({ id: idPayroll })
    },
    enabled: false
  })

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="p-1 text-blue-500 rounded-full"
          aria-label="Actualizar"
          title="Actualizar"
          onClick={async () => await refetchPayroll()}
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
              itemPayment={itemPayment}
              onClose={handleClose}
              payroll={payrollSelected}
            />
          )
        }
      </DialogContent>
    </Dialog>
  );
};