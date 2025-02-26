"use client"
import { DeleteSalary, GetSalariesByPayrollId } from "@/lib/data"
import { ConfirmDeleteDialog } from "@/modules/fixed-assets/components/ConfirmDeleteDialog"
import { SalaryDialogEdit } from "@/modules/salaries-payrolls/components/SalaryDialogEdit"
import { DataTableCustom } from "@/modules/shared/components/DataTableCustom"
import { formatNumber } from "@/modules/shared/utils/validate"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { useParams } from "next/navigation"
import { toast } from "sonner"

function SalariesPage() {
  return (
    <div className="w-full h-full grid place-content-center">
      No disponible
    </div>
  )

  // const { id } = useParams()
  // const queryClient = useQueryClient()

  // const { data: listSalaries } = useQuery({
  //   queryKey: ['AllSalaries'],
  //   queryFn: () => GetSalariesByPayrollId({ idPayroll: id.toString() })
  // })

  // const deleteMutation = useMutation({
  //   mutationFn: DeleteSalary,
  //   onSuccess: () => {
  //     toast.success("Registro eliminado correctamente!");
  //     queryClient.invalidateQueries({ queryKey: ['AllSalaries'] })
  //   },
  //   onMutate: () => {
  //     toast("eliminando registro...");
  //   },
  //   onError: (e) => {
  //     toast.error("Error al eliminar el registro");
  //     console.error(e)
  //   }
  // })

  // const columnsSalaries = [
  //   {
  //     header: "F. Registro",
  //     accessorKey: "currenDate",
  //     cell: ({ row }: any) => format(new Date(row.original.currenDate), "dd-MM-yyyy"),
  //     filterFn: (row: any, _column: any, filterValue: string) => {
  //       const formattedDate = format(row.original.currenDate, "yyyy-MM");
  //       console.log(formattedDate, filterValue)
  //       return formattedDate === filterValue;
  //     }
  //   },
  //   {
  //     header: "B. Antigüedad",
  //     accessorKey: "bonusAntiquity",
  //     cell: ({ row }: any) => formatNumber(row.original.bonusAntiquity),
  //   },
  //   {
  //     header: "B. Producción",
  //     accessorKey: "productionBonus",
  //     cell: ({ row }: any) => formatNumber(row.original.productionBonus),
  //   },
  //   {
  //     header: "H. Extras \n (min)",
  //     accessorKey: "extraTimeMinutes",
  //     cell: ({ row }: any) => formatNumber(row.original.extraTimeMinutes),
  //   },
  //   {
  //     header: "Valor H. Extras",
  //     accessorKey: "valueForOvertime",
  //     cell: ({ row }: any) => formatNumber(row.original.valueForOvertime),
  //   },
  //   {
  //     header: "AFP",
  //     accessorKey: "afp",
  //     cell: ({ row }: any) => formatNumber(row.original.afp),
  //   },
  //   {
  //     header: "Préstamo",
  //     accessorKey: "loan",
  //     cell: ({ row }: any) => formatNumber(row.original.loan),
  //   },
  //   {
  //     header: "Capacitaciones",
  //     accessorKey: "exelTrainingCorse",
  //     cell: ({ row }: any) => formatNumber(row.original.exelTrainingCorse),
  //   },
  //   {
  //     header: "Multa de ANB",
  //     accessorKey: "anbFineSettlement",
  //     cell: ({ row }: any) => formatNumber(row.original.anbFineSettlement),
  //   },
  //   {
  //     header: "A Cuenta",
  //     accessorKey: "onAccount",
  //     cell: ({ row }: any) => formatNumber(row.original.onAccount),
  //   },
  //   {
  //     header: "Descuentos",
  //     accessorKey: "dsctoShirtDelays",
  //     cell: ({ row }: any) => formatNumber(row.original.dsctoShirtDelays),
  //   },
  //   {
  //     header: "Total Ganado",
  //     accessorKey: "totalGanado",
  //     sum: true,
  //     cell: ({ row }: any) => formatNumber(row.original.totalGanado),
  //   },
  //   {
  //     header: "Líquido Pagable",
  //     accessorKey: "liquidPayable",
  //     sum: true,
  //     cell: ({ row }: any) => formatNumber(row.original.liquidPayable),
  //   },
  //   {
  //     header: "Acciones",
  //     cell: ({ row }: any) => {
  //       return (
  //         <div className="flex items-center justify-center gap-1">
  //           <SalaryDialogEdit idItem={row.original.id.toString()} />
  //           <ConfirmDeleteDialog
  //             onDelete={deleteMutation.mutate}
  //             id={id.toString()}
  //             message="Esta acción eliminará permanentemente el registro seleccionado.
  //           Asegúrate de que esta es tu intención, ya que no podrás deshacerla"
  //           />
  //         </div>
  //       )
  //     },
  //   },
  // ];

  // return (
  //   <>
  //     {
  //       listSalaries && (
  //         <section >
  //           <div className="grid grid-cols-5 items-center">
  //             <fieldset className="col-span-5 lg:col-span-4 text-xs md:text-sm lg:text-base border-2 rounded-lg p-2 mt-4 mb-6 flex">
  //               <legend>Informacion general</legend>
  //               <div className="w-1/2">
  //                 <p><span className="font-semibold">Nombres y Apellidos: </span>{listSalaries?.nombres}</p>
  //                 <p><span className="font-semibold">Genero: </span>{listSalaries?.sexo}</p>
  //                 <p><span className="font-semibold">Area: </span>{listSalaries?.area}</p>
  //                 <p><span className="font-semibold">Cargo: </span>{listSalaries?.cargo}</p>
  //               </div>
  //               <div className="w-1/2">
  //                 <p><span className="font-semibold">Fecha de entrada: </span>{format(listSalaries?.entryDate, 'dd/MM/yyyy')}</p>
  //                 <p><span className="font-semibold">Salario planilla fiscal: </span>{formatNumber(listSalaries?.salaryTaxReturn)} Bs</p>
  //                 <p><span className="font-semibold">Salario planilla interna: </span>{formatNumber(listSalaries?.internalPayrollSalary)} Bs</p>
  //               </div>
  //             </fieldset>
  //             {/* <div className="col-span-5 lg:col-span-1 flex justify-start lg:justify-end items-center">
  //               <SalaryFormDialog idPayroll={id.toString()} />
  //             </div> */}
  //           </div>

  //           <div className="max-w-full">
  //             <DataTableCustom
  //               columns={columnsSalaries}
  //               data={listSalaries?.salariesAndWagesItems}
  //               filter={{
  //                 columnName: 'currenDate',
  //                 placeholder: 'Filtrar por mes',
  //                 type: 'month'
  //               }}
  //             />
  //           </div>
  //         </section>
  //       )
  //     }
  //   </>
  // )

}
export default SalariesPage