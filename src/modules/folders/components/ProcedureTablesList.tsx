"use client";

import { DataTable } from "@/components/ui/data-table";
import { ProcedureDataset } from "@/lib/trazoTypes";
import { columns } from "./subdata-columns";

type ProcedureTablesListProps = {
  procedureDataset: ProcedureDataset;
};

export default function ProcedureTablesList({
  procedureDataset,
}: ProcedureTablesListProps) {
  return (
    <div className="space-y-4">
      <h1>Planillaje y Facturacion Contable</h1>
      <div>Tributos y Otros Conceptos Aduaneros</div>
      <DataTable
        data={procedureDataset["a-TributosYOtrosConceptosAduanerosSubDatas"] ?? []}
        columns={columns}
      />
      <div>Otros Gastos de Importacion/Exportacion</div>
      <DataTable
        data={procedureDataset["b-OtrosGastosDeImportacion/ExportacionSubDatas"] ?? []}
        columns={columns}
      />
      <div>Gastos de Operaciones</div>
      <DataTable
        data={procedureDataset["c-GastosDeOperacionesSubDatas"] ?? []}
        columns={columns}
      />
      <div>Honorarios Profesionales</div>
      <DataTable
        data={procedureDataset["d-HonorariosProfesionalesSubDatas"] ?? []}
        columns={columns}
      />
    </div>
  );
}
