"use client"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DeletePayroll, GetPayrollExcelByDate, GetPayrollsAndSalaries } from "@/lib/data";
import { ConfirmDeleteDialog } from "@/modules/fixed-assets/components/ConfirmDeleteDialog";
import { PayrollsDialogEdit } from "@/modules/salaries-payrolls/components/PayrollDialogEdit";
import { PayrollsDialogForm } from "@/modules/salaries-payrolls/components/PayrollsDialogForm";
import PaySlipDialog from "@/modules/salaries-payrolls/components/PaySlipDialog";
import { formatNumber } from "@/modules/shared/utils/validate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CircleDollarSignIcon, EyeIcon, HandCoinsIcon, SheetIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { SalaryDialogEdit } from "@/modules/salaries-payrolls/components/SalaryDialogEdit";
import { DataTablePayrollsSalaries } from "@/modules/salaries-payrolls/components/TablePayrolls";
import { SalaryFormDialog } from "@/modules/salaries-payrolls/components/SalaryFormDialog";

function SalariesPayrollsPage() {

  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM'));

  const { data: listPayrolls } = useQuery({
    queryKey: ['AllPayrolls', selectedDate],
    queryFn: () => {
      return GetPayrollsAndSalaries({ date: selectedDate });
    }
  })

  const { refetch: refetchExcel } = useQuery({
    queryKey: [selectedDate],
    queryFn: () => {
      const dateSelected = selectedDate || new Date();
      return GetPayrollExcelByDate({ date: format(dateSelected, 'yyyy-MM') });
    },
    enabled: false
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

  const onHandleGenerateExcel = async () => {
    try {
      toast.info("Generando archivo Excel...");
      const { data: linkExcel } = await refetchExcel();
      const fileUrl = linkExcel instanceof Blob ? URL.createObjectURL(linkExcel) : linkExcel;

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "planillas.xlsx";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      if (linkExcel instanceof Blob) {
        URL.revokeObjectURL(fileUrl);
      }

      toast.success("Archivo Excel generado y descargado correctamente.");
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
      toast.error("Ocurrió un error al generar el archivo Excel. Por favor, inténtalo de nuevo.");
    }
  };

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
      header: "Fecha de ingreso",
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
      header: "Bono Antiguedad",
      accessorKey: "bonusAntiquity",
      cell: ({ row }: any) => formatNumber(row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].bonusAntiquity : 0),
    },
    {
      header: "Bono produccion",
      accessorKey: "productionBonus",
      cell: ({ row }: any) => formatNumber(row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].productionBonus : 0),
    },
    {
      header: "Tiempo extra \n (minutos)",
      accessorKey: "extraTimeMinutes",
      cell: ({ row }: any) => formatNumber(row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].extraTimeMinutes : 0),
    },
    {
      header: "Valor horas extras",
      accessorKey: "valueForOvertime",
      cell: ({ row }: any) => formatNumber(row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].valueForOvertime : 0),
    },
    {
      header: "Total ganado",
      accessorKey: "totalGanado",
      cell: ({ row }: any) => formatNumber(row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].totalGanado : 0),
    },
    {
      header: "AFP",
      accessorKey: "afp",
      cell: ({ row }: any) => formatNumber(row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].afp : 0),
    },
    {
      header: "Prestamo",
      accessorKey: "loan",
      cell: ({ row }: any) => formatNumber(row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].loan : 0),
    },
    {
      header: "Cursos capacitacion",
      accessorKey: "exelTrainingCorse",
      cell: ({ row }: any) => row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].exelTrainingCorse : 0,
    },
    {
      header: "Multa ANB",
      accessorKey: "anbFineSettlement",
      cell: ({ row }: any) => formatNumber(row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].anbFineSettlement : 0),
    },
    {
      header: "A cuenta",
      accessorKey: "onAccount",
      cell: ({ row }: any) => formatNumber(row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].onAccount : 0),
    },
    {
      header: "Retrasos",
      accessorKey: "dsctoShirtDelays",
      cell: ({ row }: any) => formatNumber(row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].dsctoShirtDelays : 0),
    },
    {
      header: "Liquido pagable",
      accessorKey: "liquidPayable",
      cell: ({ row }: any) => formatNumber(row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].liquidPayable : 0),
    },
    {
      header: "Acciones",
      cell: ({ row }: any) => {
        const idPayroll = row.original.id
        const createDisabled = row.original.salariesAndWagesItems[0] && row.original.salariesAndWagesItems[0].id.toString()
        return (
          <div className="flex items-center justify-center gap-1">
            <div className={`${createDisabled ? "hidden" : "block"}`}>
              <SalaryFormDialog
                idPayroll={row.original.id.toString()}
                buttonElement={
                  <Button
                    disabled={row.original.salariesAndWagesItems[0] ? row.original.salariesAndWagesItems[0].liquidPayable : false}
                    variant="outline"
                    size="icon"
                    className="p-1 text-blue-500 rounded-full"
                    aria-label="Pagar Salario"
                    title="Pagar Salario"
                  >
                    <CircleDollarSignIcon />
                  </Button>
                }
              />
            </div>
            <div className={`${createDisabled ? "block" : "hidden"}`}>
              <SalaryDialogEdit
                idItem={row.original.salariesAndWagesItems[0] && row.original.salariesAndWagesItems[0].id.toString()}
                buttonElement={
                  <Button
                    variant="outline"
                    className="size-10 p-2 text-blue-500 rounded-full"
                    aria-label="Actualizar Salario"
                    title="Actualizar Salario"
                  >
                    <HandCoinsIcon />
                  </Button>
                }
              />
            </div>
            <PaySlipDialog
              idSalaryWages={idPayroll}
              datePaySlip={(new Date()).toISOString()}
            />
            <Button
              variant="outline"
              size="icon"
              className="p-1 text-blue-500 rounded-full"
              aria-label="Ver Pagos"
              title="Ver Pagos"
            >
              <Link href={`/dashboard/salaries-payrolls/${row.original.id}/salaries`}>
                <EyeIcon />
              </Link>
            </Button>
            <PayrollsDialogEdit
              idPayroll={idPayroll}
            />
            <ConfirmDeleteDialog
              message="Esta acción eliminará permanentemente la planilla seleccionada.
            Asegúrate de que esta es tu intención, ya que no podrás deshacerla"
              id={row.original.id}
              onDelete={deleteMutation.mutate}
            />
          </div >
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

      <div className="flex items-end gap-4 mt-3 mb-6 ">
        <Label className="flex flex-col gap-3 w-fit" >
          Seleccione la fecha de inicio
          <Input
            type="month"
            onChange={(e) => {
              setSelectedDate(e.target.value);
            }}
            value={selectedDate}
          />
        </Label>

        <Button
          className="flex gap-2 items-center"
          onClick={onHandleGenerateExcel}>
          <SheetIcon />Descargar Excel
        </Button>
      </div>

      {
        listPayrolls && (
          <>
            <div className="flex justify-start pb-3">
              <DataTablePayrollsSalaries
                filter={{ type: "text", placeholder: "Buscar personal...", columnName: "nombres" }}
                columns={columnsPayrolls}
                data={listPayrolls.listSalariesWages}
              />
            </div>
            <div className="flex flex-col justify-end gap-2 py-4 rounded-lg text-[#64748b]">
              <h2 className="text-lg font-bold">RESULTADOS</h2>
              <ul className="grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
                <li>
                  <fieldset className="border-2 rounded-xl p-2">
                    <legend>Salarios</legend>
                    <p><span className="font-semibold ">Salario fiscal:  </span>{formatNumber(listPayrolls.salaryTaxReturnTotal)}</p>
                    <p><span className="font-semibold ">Salario interno:  </span>{formatNumber(listPayrolls.internalPayrollSalaryTotal)}</p>
                  </fieldset>
                </li>
                <li>
                  <fieldset className="border-2 rounded-xl p-2">
                    <legend>Bonos</legend>
                    <p><span className="font-semibold ">Bonos de antiguedad: </span>{formatNumber(listPayrolls.bonusAntiquityTotal)}</p>
                    <p><span className="font-semibold ">Bonos de produccion: </span>{formatNumber(listPayrolls.productionBonus)}</p>
                  </fieldset>
                </li>
                <li>
                  <fieldset className="border-2 rounded-xl p-2">
                    <legend>Deducciones</legend>
                    <p><span className="font-semibold ">AFP: </span>{formatNumber(listPayrolls.afpTotal)}</p>
                    <p><span className="font-semibold ">Prestamos: </span>{formatNumber(listPayrolls.loanTotal)}</p>
                    <p><span className="font-semibold ">Cursos de capacitacion: </span>{listPayrolls.exelTrainingCorseTotal}</p>
                    <p><span className="font-semibold ">Multas ANB: </span>{formatNumber(listPayrolls.anbFineSettlementTotal)}</p>
                    <p><span className="font-semibold ">Retrasos: </span>{formatNumber(listPayrolls.dsctoShirtDelaysTotal)}</p>
                  </fieldset>
                </li>
                <li>
                  <fieldset className="border-2 rounded-xl p-2">
                    <legend>Totales</legend>
                    <p><span className="font-semibold ">Total ganado: </span>{formatNumber(listPayrolls.totalGanadoT)}</p>
                    <p><span className="font-semibold ">A cuenta: </span>{formatNumber(listPayrolls.onAccountTotal)}</p>
                    <p><span className="font-semibold ">Liquido pagable: </span>{formatNumber(listPayrolls.liquidPayableTotal)}</p>
                  </fieldset>
                </li>
              </ul>
            </div>
          </>
        )
      }
    </section >
  );
}

export default SalariesPayrollsPage