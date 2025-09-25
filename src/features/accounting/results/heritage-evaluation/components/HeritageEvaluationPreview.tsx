"use client";

import { DataTable } from "@/components/ui/data-table";
import { HeritageEvaluationData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { HeritageEvaluationGraph } from "./HeritageEvaluationGraph";

const heritageColumns: ColumnDef<HeritageEvaluationData["items"][0]>[] = [
  {
    header: "Concepto",
    accessorKey: "sldDateText",
  },
  {
    header: "Capital Social",
    accessorKey: "sldPaidCapital",
  },
  {
    header: "Reserva Legal",
    accessorKey: "sldLegalReserv",
  },
  {
    header: "Ajuste de Capital",
    accessorKey: "sldCapitalAdjust",
  },
  {
    header: "Resultados Acumulados",
    accessorKey: "sldCumulResults",
  },
  {
    header: "Total",
    accessorKey: "sldNetWorth",
  },
];

export default function HeritageEvaluationPreview({data,}: {data: HeritageEvaluationData;}) {
  return (
    <section className="w-full border px-4 py-8 flex flex-col items-center bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-300">
          EVOLUCIÓN DEL PATRIMONIO NETO
        </h1>
        <div className="flex flex-col justify-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            Del <span className="font-semibold">{data.initDate}</span> al{" "}
            <span className="font-semibold">{data.endDate}</span>
          </p>
          <p className="font-medium">
            (Expresado en {data.inSus ? "dólares (USD)" : "bolivianos (BOB)"})
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 dark:bg-gray-800">
        <div className="lg:col-span-2 overflow-x-auto">
          <DataTable
            data={[...data?.items ?? [], data.resultFinal]}
            columns={heritageColumns}
          />
        </div>
        <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200 dark:bg-gray-800">
          <HeritageEvaluationGraph data={data} />
        </div>
      </div>
    </section>
  );
}
