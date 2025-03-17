"use client";

import { DataTable } from "@/components/ui/nested-header-data-table";
import { fetchBudgetExecutionData } from "@/lib/data";
import { BudgetExecutionData } from "@/lib/types";
import { numberWithDecimals } from "@/modules/shared/utils/validate";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";

export default function BudgetExecutionPage() {
  const {
    data: budgetExecution,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["BudgetExecution"],
    queryFn: fetchBudgetExecutionData,
  });

  if (isError) {
    return <div>Hubo un error al obtener los datos</div>;
  }

  if (isLoading || !budgetExecution) {
    return <div>Cargando datos...</div>;
  }

  return (
    <main className="flex flex-col w-full gap-8">
      <h1 className="font-bold text-4xl">Ejecución Presupuestaria</h1>
      <DataTable data={budgetExecution.list} columns={columns} />
      <div className="grid grid-cols-10 border-t border-gray-300 text-xs">
        <div className="col-span-2 font-bold text-center border-r border-gray-300 p-2">
          TOTALES
        </div>
        {Object.values(budgetExecution.totals).map((total, index) => (
          <div key={index} className="text-center border-r border-gray-300 p-2">
            {numberWithDecimals(total)}
          </div>
        ))}
      </div>
    </main>
  );
}

const columns: ColumnDef<BudgetExecutionData>[] = [
  {
    header: "DETALLE",
    columns: [
      { header: "CUENTA", accessorKey: "description" },
      { header: "ETIQUETA", accessorKey: "tag" },
    ],
  },
  {
    header: "PRESUPUESTO",
    columns: [
      {
        header: "INICIAL",
        columns: [
          { header: "ANUAL", accessorFn: (row) => numberWithDecimals(row.initial.annual) },
          { header: "MENSUAL", accessorFn: (row) => numberWithDecimals(row.initial.monthly) },
        ],
      },
      {
        header: "MODIFICACIONES",
        columns: [
          { header: "ANUAL", accessorFn: (row) => numberWithDecimals(row.modifications.annual) },
          { header: "MENSUAL", accessorFn: (row) => numberWithDecimals(row.modifications.monthly) },
        ],
      },
      {
        header: "VIGENTE",
        columns: [
          { header: "ANUAL", accessorFn: (row) => numberWithDecimals(row.inEffect.annual) },
          { header: "MENSUAL", accessorFn: (row) => numberWithDecimals(row.inEffect.monthly) },
        ],
      },
    ],
  },
  {
    header: "DESEMBOLSOS",
    columns: [
      {
        header: "EJECUTADOS",
        accessorFn: (row) => numberWithDecimals(row.disbursements),
      },
    ],
  },
  {
    header: "DESVIACION",
    accessorFn: (row) => numberWithDecimals(row.deviation),
  },
  // {
  //   header: "EJECUCION",
  //   accessorKey: "execution",
  // },
];
