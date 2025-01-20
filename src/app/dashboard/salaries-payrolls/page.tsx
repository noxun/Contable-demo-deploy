"use client"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Label } from "@/components/ui/label";
import { DeletePayroll, GetPayrolls } from "@/lib/data";
import { ConfirmDeleteDialog } from "@/modules/fixed-assets/components/ConfirmDeleteDialog";
import { DatePicker } from "@/modules/fixed-assets/components/DatePicker";
import { PayrollsDialogForm } from "@/modules/salaries-payrolls/components/PayrollsDialogForm";
import PaySlipDialog from "@/modules/salaries-payrolls/components/PaySlipDialog";
import { formatNumber } from "@/modules/shared/utils/validate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { EyeIcon, FilePenLineIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function SalariesPayrollsPage() {

  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { data: listPayrolls } = useQuery({
    queryKey: ['AllPayrolls', selectedDate],
    queryFn: () => {
      const dateSelected = selectedDate || new Date();
      return GetPayrolls({ date: format(dateSelected, 'yyyy-MM-dd') });
    }
  })

  const deleteMutation = useMutation({
    mutationFn: DeletePayroll,
    onSuccess: () => {
      toast.success('Planilla eliminada correctamente')
      queryClient.invalidateQueries({ queryKey: ['AllPayrolls'] })
    },
    onError: (error) => {
      toast.error('Error al eliminar la planilla')
      console.error('Ocurrio un error al eliminar la planilla: ', error)
    },
    onMutate: () => {
      toast("Eliminando activo fijo...")
    }
  })

  const columnsPayrolls = [
    {
      header: "Nombre",
      accessorKey: "nombres",
      cell: ({ row }: any) => row.original.nombres,
    },
    {
      header: "Area",
      accessorKey: "area",
      cell: ({ row }: any) => row.original.area,
    },
    {
      header: "Cargo",
      accessorKey: "cargo",
      cell: ({ row }: any) => row.original.cargo,
    },
    {
      header: "Sexo",
      accessorKey: "sexo",
      cell: ({ row }: any) => row.original.sexo.toUpperCase(),
    },
    {
      header: "Fecha de inicio",
      accessorKey: "entryDate",
      cell: ({ row }: any) => format(new Date(row.original.entryDate), "dd-MM-yyyy")
    },
    {
      header: "Salario fiscal",
      accessorKey: "salaryTaxReturn",
      cell: ({ row }: any) => formatNumber(row.original.salaryTaxReturn),
    },
    {
      header: "Salario interno",
      accessorKey: "internalPayrollSalary",
      cell: ({ row }: any) => formatNumber(row.original.internalPayrollSalary),
    },
    {
      header: "Acciones",
      cell: ({ row }: any) => {
        const idPayroll = row.original.id
        return (
          <div className="flex items-center justify-center gap-1">
            {/* los props ve si esta bien la fecha asi xd */}
            <PaySlipDialog idSalaryWages={idPayroll} datePaySlip={(new Date()).toISOString()}/>
            <Button
              variant="outline"
              className="size-10 p-2 text-blue-500 rounded-full"
              aria-label="Ver Pagos"
              title="Ver Pagos"
            >
              <EyeIcon />
            </Button>
            <Button
              variant="outline"
              className="size-10 p-2 text-blue-500 rounded-full"
              aria-label="Actualizar"
              title="Actualizar"
            >
              <FilePenLineIcon />
            </Button>
            <ConfirmDeleteDialog
              message="Esta acción eliminará permanentemente la planilla seleccionada.
            Asegúrate de que esta es tu intención, ya que no podrás deshacerla"
              id={row.original.id}
              onDelete={deleteMutation.mutate}
            />
          </div>
        )
      },
    },
  ];


  return (
    <section className="px-6">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-lg font-semibold">Planillas y salarios</h2>
        <PayrollsDialogForm />
      </div>

      <Label className="flex flex-col gap-3 pt-3 pb-5 mb-6" >
        Seleccione la fecha de inicio
        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
      </Label>

      {
        listPayrolls && (

          <div>
            <DataTable columns={columnsPayrolls} data={listPayrolls} />
          </div>
        )
      }


    </section >
  );
}

export default SalariesPayrollsPage