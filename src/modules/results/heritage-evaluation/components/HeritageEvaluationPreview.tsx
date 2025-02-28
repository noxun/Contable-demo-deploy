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
    header: "Ajuste de Capital",
    accessorKey: "sldCapitalAdjust",
  },
  {
    header: "Reserva Legal",
    accessorKey: "sldLegalReserv",
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

export default function HeritageEvaluationPreview({
  data,
}: {
  data: HeritageEvaluationData;
}) {
  return (
    <section className="w-full flex flex-col items-center">
      <h2>EVOLUCION DEL PATRIMONIO NETO</h2>
      <h3>
        Por el ejercicio comprendido desde el {data.initDate} al {data.endDate}
      </h3>
      <h3>(Expresado en {data.inSus ? "dolares" : "bolivianos"})</h3>
      <DataTable
        data={[...data?.items ?? [], data.resultFinal]}
        columns={heritageColumns}
      />
      <HeritageEvaluationGraph data={data} />
    </section>
  );
}

