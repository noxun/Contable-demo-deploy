"use client"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DeleteSalary, GetSalariesByPayrollId } from "@/lib/data"
import { ConfirmDeleteDialog } from "@/modules/fixed-assets/components/ConfirmDeleteDialog"
import { SalaryFormDialog } from "@/modules/salaries-payrolls/components/SalaryFormDialog"
import { formatNumber } from "@/modules/shared/utils/validate"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { FilePenLineIcon, Trash2Icon } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

function SalariesPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: listSalaries } = useQuery({
    queryKey: ['AllSalaries'],
    queryFn: () => GetSalariesByPayrollId({ idPayroll: id.toString() })
  })

  const deleteMutation = useMutation({
    mutationFn: DeleteSalary,
    onSuccess: () => {
      toast.success("Registro eliminado correctamente!");
      queryClient.invalidateQueries({ queryKey: ['AllSalaries'] })
    },
    onMutate: () => {
      toast("eliminando registro...");
    },
    onError: (e) => {
      toast.error("Error al eliminar el registro");
      console.error(e)
    }
  })

  const columnsSalaries = [
    {
      header: "Bono por Antigüedad",
      accessorKey: "bonusAntiquity",
      cell: ({ row }: any) => formatNumber(row.original.bonusAntiquity),
    },
    {
      header: "Bono de Producción",
      accessorKey: "productionBonus",
      cell: ({ row }: any) => formatNumber(row.original.productionBonus),
    },
    {
      header: "Minutos de Horas Extras",
      accessorKey: "extraTimeMinutes",
      cell: ({ row }: any) => formatNumber(row.original.extraTimeMinutes),
    },
    {
      header: "Valor por Horas Extras",
      accessorKey: "valueForOvertime",
      cell: ({ row }: any) => formatNumber(row.original.valueForOvertime),
    },
    {
      header: "Préstamo",
      accessorKey: "loan",
      cell: ({ row }: any) => formatNumber(row.original.loan),
    },
    {
      header: "Curso de Capacitación en Excel",
      accessorKey: "exelTrainingCorse",
      cell: ({ row }: any) => formatNumber(row.original.exelTrainingCorse),
    },
    {
      header: "Liquidación de Multa de ANB",
      accessorKey: "anbFineSettlement",
      cell: ({ row }: any) => formatNumber(row.original.anbFineSettlement),
    },
    {
      header: "A Cuenta",
      accessorKey: "onAccount",
      cell: ({ row }: any) => formatNumber(row.original.onAccount),
    },
    {
      header: "Descuento por Retrasos",
      accessorKey: "dsctoShirtDelays",
      cell: ({ row }: any) => formatNumber(row.original.dsctoShirtDelays),
    },
    {
      header: "Acciones",
      accessorKey: "",
      cell: ({ row }: any) => {
        const assetId = row.original.id
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="outline"
              className="size-10 p-2 text-blue-500 rounded-full"
              aria-label="Actualizar"
              title="Actualizar"
              onClick={() => { }}
            >
              <FilePenLineIcon />
            </Button>
            <ConfirmDeleteDialog
              onDelete={deleteMutation.mutate}
              id={id.toString()}
              message="Esta acción eliminará permanentemente el registro seleccionado.
            Asegúrate de que esta es tu intención, ya que no podrás deshacerla"
            />
          </div>
        )
      },
    },
  ];

  return (
    <section className="px-6">

      {
        listSalaries && (
          <>
            <section className="grid grid-cols-5 items-center">
              <fieldset className="col-span-4 border-2 rounded-lg p-2 mt-4 mb-6 flex">
                <legend>Informacion general</legend>
                <div className="w-1/2">
                  <p><span className="font-semibold">Nombres y Apellidos: </span>{listSalaries?.nombres}</p>
                  <p><span className="font-semibold">Genero: </span>{listSalaries?.sexo}</p>
                  <p><span className="font-semibold">Area: </span>{listSalaries?.area}</p>
                  <p><span className="font-semibold">Cargo: </span>{listSalaries?.cargo}</p>
                </div>
                <div className="w-1/2">
                  <p><span className="font-semibold">Fecha de entrada: </span>{format(listSalaries?.entryDate, 'dd/MM/yyyy')}</p>
                  <p><span className="font-semibold">Salario planilla fiscal: </span>{formatNumber(listSalaries?.salaryTaxReturn)} Bs</p>
                  <p><span className="font-semibold">Salario planilla interna: </span>{formatNumber(listSalaries?.internalPayrollSalary)} Bs</p>
                </div>
              </fieldset>
              <div className="flex justify-end items-center">
                <SalaryFormDialog idPayroll={id.toString()} />
              </div>
            </section>
            <DataTable columns={columnsSalaries} data={listSalaries?.salariesAndWagesItems} />
          </>
        )
      }



    </section>
  )

}
export default SalariesPage