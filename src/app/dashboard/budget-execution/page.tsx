"use client";

import { DataTable } from "@/components/ui/nested-header-data-table";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
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
      <div className="grid grid-cols-10 border-t border-gray-300">
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
      { header: "CUENTA", accessorKey: "codeAccount" },
      { header: "ETIQUETA", accessorKey: "tag" },
    ],
  },
  {
    header: "PRESUPUESTO",
    columns: [
      {
        header: "INICIAL",
        columns: [
          { header: "ANUAL", accessorFn: (row) => row.initial.annual },
          { header: "MENSUAL", accessorFn: (row) => row.initial.monthly },
        ],
      },
      {
        header: "MODIFICACIONES",
        columns: [
          { header: "ANUAL", accessorFn: (row) => row.modifications.annual },
          { header: "MENSUAL", accessorFn: (row) => row.modifications.monthly },
        ],
      },
      {
        header: "VIGENTE",
        columns: [
          { header: "ANUAL", accessorFn: (row) => row.inEffect.annual },
          { header: "MENSUAL", accessorFn: (row) => row.inEffect.monthly },
        ],
      },
    ],
  },
  {
    header: "DESEMBOLSOS",
    columns: [
      {
        header: "EJECUTADOS",
        accessorKey: "disbursements",
      },
    ],
  },
  {
    header: "DESVIACION",
    accessorKey: "deviation",
  },
  // {
  //   header: "EJECUCION",
  //   accessorKey: "execution",
  // },
];
