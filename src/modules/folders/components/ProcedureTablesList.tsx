"use client";

import { DataTable } from "@/components/ui/data-table";
import { ProcedureDataset } from "@/lib/trazoTypes";
import { columns } from "./subdata-columns";
import ButtonRegisterVoucherByDoc from "./ButtonRegisterVoucherByDoc";

type ProcedureTablesListProps = {
  procedureDataset: ProcedureDataset;
  value: string;
};

export default function ProcedureTablesList({
  procedureDataset,
  value,
}: ProcedureTablesListProps) {
  return (
    <div className="space-y-4">
      <section>
        <div>a|Tributos y Otros Conceptos Aduaneros</div>
        <DataTable
          data={
            procedureDataset["a-TributosYOtrosConceptosAduanerosSubDatas"] ?? []
          }
          columns={columns(procedureDataset.procedureId)}
        />
      </section>
      <section>
        <div>b|Otros Gastos de Importación/Exportación</div>
        <DataTable
          data={
            procedureDataset[
              "b-OtrosGastosDeImportacion/ExportacionSubDatas"
            ] ?? []
          }
          columns={columns(procedureDataset.procedureId)}
        />
      </section>
      <section>
        <div>c|Gastos de Operaciones</div>
        <DataTable
          data={procedureDataset["c-GastosDeOperacionesSubDatas"] ?? []}
          columns={columns(procedureDataset.procedureId)}
        />
        {procedureDataset["c-GastosDeOperacionesSubDatas"] !== undefined &&
        procedureDataset["c-GastosDeOperacionesSubDatas"].length > 0 ? (
          <ButtonRegisterVoucherByDoc
            items={procedureDataset["c-GastosDeOperacionesSubDatas"]}
            centroCostos={procedureDataset.centroCostos}
            sucursal={procedureDataset.sucursal}
            internCode={value}
            companyRazonSocial={procedureDataset.company.razonSocial}
            type="c"
          />
        ) : null}
      </section>
      <section>
        <div>d|Honorarios Profesionales</div>
        <DataTable
          data={procedureDataset["d-HonorariosProfesionalesSubDatas"] ?? []}
          columns={columns(procedureDataset.procedureId)}
        />
        {procedureDataset["d-HonorariosProfesionalesSubDatas"] !== undefined &&
        procedureDataset["d-HonorariosProfesionalesSubDatas"].length > 0 ? (
          <ButtonRegisterVoucherByDoc
            items={procedureDataset["d-HonorariosProfesionalesSubDatas"]}
            centroCostos={procedureDataset.centroCostos}
            sucursal={procedureDataset.sucursal}
            internCode={value}
            companyRazonSocial={procedureDataset.company.razonSocial}
            type="d"
          />
        ) : null}
      </section>
    </div>
  );
}
