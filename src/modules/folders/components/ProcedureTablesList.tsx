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
    <div>
      <h1>Planillaje y Facturacion Contable</h1>
      <div>{procedureDataset["a-TributosYOtrosConceptosAduaneros"]}</div>
      <DataTable
        data={procedureDataset["a-TributosYOtrosConceptosAduanerosSubDatas"]}
        columns={columns}
      />
      <div>{procedureDataset["b-OtrosGastosDeImportacion/Exportacion"]}</div>
      <DataTable
        data={procedureDataset["b-OtrosGastosDeImportacion/ExportacionSubDatas"]}
        columns={columns}
      />
      <div>
        {procedureDataset["c-GastosDeOperaciones"]}
      </div>
      <div>{procedureDataset["c-GastosDeOperaciones"]}</div>
      <DataTable
        data={procedureDataset["c-GastosDeOperacionesSubDatas"] ?? []}
        columns={columns}
      />
      <div>{procedureDataset["d-HonorariosProfesionales"]}</div>
      <DataTable
        data={procedureDataset["d-HonorariosProfesionalesSubDatas"] ?? []}
        columns={columns}
      />
    </div>
  );
}
