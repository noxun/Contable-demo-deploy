"use client"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DeletePayroll, GetPayrollExcelByDate, GetPayrollsAndSalaries, updatePaymentStatusByEmployeeId } from "@/lib/data";
import { ConfirmDeleteDialog } from "@/modules/fixed-assets/components/ConfirmDeleteDialog";
import { PayrollsDialogEdit } from "@/modules/salaries-payrolls/components/PayrollDialogEdit";
import { PayrollsDialogForm } from "@/modules/salaries-payrolls/components/PayrollsDialogForm";
import PaySlipDialog from "@/modules/salaries-payrolls/components/PaySlipDialog";
import { formatNumber } from "@/modules/shared/utils/validate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckIcon, CircleDollarSignIcon, Clock3Icon, ClockIcon, EyeIcon, HandCoinsIcon, ReceiptIcon, SheetIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { SalaryDialogEdit } from "@/modules/salaries-payrolls/components/SalaryDialogEdit";
import { DataTablePayrollsSalaries } from "@/modules/salaries-payrolls/components/TablePayrolls";

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
      return GetPayrollExcelByDate({ date: selectedDate });
    },
    enabled: false
  })

  const deleteMutation = useMutation({
    mutationFn: DeletePayroll,
    onSuccess: () => {
      toast.success('Funcionario eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['AllPayrolls'] })
    },
    onError: (error) => {
      toast.error('Error al eliminar el funcionario')
      console.error('Ocurrio un error al eliminar el funcionario: ', error)
    },
    onMutate: () => {
      toast("Eliminando funcionario..")
    }
  })

  const updatePaidSalary = useMutation({
    mutationFn: updatePaymentStatusByEmployeeId,
    onSuccess: () => {
      toast.success('Funcionario actualizado correctamente')
      queryClient.invalidateQueries({ queryKey: ['AllPayrolls'] })
    },
    onError: (error) => {
      toast.error('Error al actualizar el funcionario')
      console.error('Ocurrio un error al actualizar el funcionario: ', error)
    },
    onMutate: () => {
      toast("Actualizando funcionario...")
    }
  })

  const onUpdatePaymentStatus = (id: string, paid: boolean) => {
    if (paid) return updatePaidSalary.mutate({ idEmployee: id, paid: false });
    updatePaidSalary.mutate({ idEmployee: id, paid: true });
  }

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
      isSticky: true,
      header: "Nombre",
      accessorKey: "nombres",
      cell: ({ row }: any) => <p className="whitespace-nowrap">{row.original.nombres}</p>,
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
      cell: ({ row }: any) => <p className="text-center">{row.original.sexo.toUpperCase()}</p>,
    },
    {
      header: "Fecha de ingreso",
      accessorKey: "entryDate",
      cell: ({ row }: any) => <p className="whitespace-nowrap">{format(new Date(row.original.entryDate), "dd-MM-yyyy")}</p>
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
      cell: ({ row }: any) => formatNumber(row.original.bonusAntiquity),
    },
    {
      header: "Bono produccion",
      accessorKey: "productionBonus",
      cell: ({ row }: any) => formatNumber(row.original.productionBonus),
    },
    {
      header: "Tiempo extra \n (minutos)",
      accessorKey: "extraTimeMinutes",
      cell: ({ row }: any) => row.original.extraTimeMinutes,
    },
    {
      header: "Valor horas extras",
      accessorKey: "valueForOvertime",
      cell: ({ row }: any) => formatNumber(row.original.valueForOvertime),
    },
    {
      header: "Total ganado",
      accessorKey: "totalGanado",
      cell: ({ row }: any) => formatNumber(row.original.totalGanado),
    },
    {
      header: "Gestora",//AFP
      accessorKey: "afp",
      cell: ({ row }: any) => formatNumber(row.original.afp),
    },
    {
      header: "Prestamo",
      accessorKey: "loan",
      cell: ({ row }: any) => formatNumber(row.original.loan),
    },
    {
      header: "Cursos capacitacion",
      accessorKey: "exelTrainingCorse",
      cell: ({ row }: any) => row.original.exelTrainingCorse,
    },
    {
      header: "Multa ANB",
      accessorKey: "anbFineSettlement",
      cell: ({ row }: any) => formatNumber(row.original.anbFineSettlement),
    },
    {
      header: "A cuenta",
      accessorKey: "onAccount",
      cell: ({ row }: any) => formatNumber(row.original.onAccount),
    },
    {
      header: "Retrasos",
      accessorKey: "dsctoShirtDelays",
      cell: ({ row }: any) => formatNumber(row.original.dsctoShirtDelays),
    },
    {
      header: "Liquido pagable",
      accessorKey: "liquidPayable",
      cell: ({ row }: any) => formatNumber(row.original.liquidPayable),
    },
    {
      header: "Pagos",
      cell: ({ row }: any) => {
        const idPayroll = row.original.id
        const paymentStatus = row.original.isPaid
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="p-1 text-blue-500 rounded-full"
              aria-label={(!paymentStatus) ? "Pagar Salario" : "Pagado"}
              title={(!paymentStatus) ? "Pagar Salario" : "Pagado"}
              onClick={() => onUpdatePaymentStatus(row.original.idItems, paymentStatus)}
            >
              {(paymentStatus) && <ReceiptIcon />}
              {(!paymentStatus) && <Clock3Icon />}
            </Button>
            <SalaryDialogEdit idItem={row.original.idItems.toString()} />
            <PaySlipDialog
              idSalaryWages={idPayroll}
              datePaySlip={format(new Date(), 'yyyy-MM-dd')}
            />
          </div >
        )
      },
    },
    {
      header: "Personal",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center justify-center gap-1">
            {/* <Button
              variant="outline"
              size="icon"
              className="p-1 text-blue-500 rounded-full"
              aria-label="Ver Pagos"
              title="Ver Pagos"
            >
              <Link href={`/dashboard/accounting/salaries-payrolls/${row.original.id}/salaries`}>
                <EyeIcon />
              </Link>
            </Button> */}
            <PayrollsDialogEdit
              itemPayment={{
                idItems: row.original.idItems,
                bonusAntiquity: row.original.bonusAntiquity,
                extraTimeMinutes: row.original.extraTimeMinutes,
                valueForOvertime: row.original.valueForOvertime,
                productionBonus: row.original.productionBonus,
                loan: row.original.loan,
                exelTrainingCorse: row.original.exelTrainingCorse,
                anbFineSettlement: row.original.anbFineSettlement,
                onAccount: row.original.onAccount,
                dsctoShirtDelays: row.original.dsctoShirtDelays,
              }}
              idPayroll={row.original.idItems}
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
    <section className="w-full">
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
            <div className="w-auto py-3 overflow-x-scroll">
              <DataTablePayrollsSalaries
                filter={{ type: "text", placeholder: "Buscar personal...", columnName: "nombres" }}
                columns={columnsPayrolls}
                data={listPayrolls.itemsSalariesWages}
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
                    <p><span className="font-semibold ">Gestora: </span>{formatNumber(listPayrolls.afpTotal)}</p>
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