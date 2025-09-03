"use client";

import { DataTable } from "@/components/ui/data-table";
import { ProcedureDataset } from "@/lib/trazoTypes";
import { columns } from "./subdata-columns";
import ButtonRegisterVoucherByDoc from "./ButtonRegisterVoucherByDoc";
import AddPayrollSubDataForm from "./AddPayrollSubDataForm";
import SendAllSubDatasButton from "./SendAllSubDatasButton";

type ProcedureTablesListProps = {
  procedureDataset: ProcedureDataset;
  totalProformaBs: string;
  value: string;
};

export default function ProcedureTablesList({
  procedureDataset,
  value, //interncode
  totalProformaBs,
}: ProcedureTablesListProps) {
  return (
    <div className="space-y-4">
      <h1>Planilla {value}</h1>
      <SendAllSubDatasButton
        totalProformaBs={totalProformaBs}
        procedureDataset={procedureDataset}
        internCode={value}
      />
      <section>
        <AddPayrollSubDataForm
          urlLabel="atributos"
          procedureId={procedureDataset.procedureId}
          fieldId={531}
        />
        <div>a|Tributos y Otros Conceptos Aduaneros</div>
        <DataTable
          data={
            procedureDataset["a-TributosYOtrosConceptosAduanerosSubDatas"] ?? []
          }
          columns={columns(procedureDataset.procedureId, "atributos")}
        />
      </section>
      <section>
        <AddPayrollSubDataForm
          urlLabel="botrosgastos"
          procedureId={procedureDataset.procedureId}
          fieldId={532}
        />
        <div>b|Otros Gastos de Importación/Exportación</div>
        <DataTable
          data={
            procedureDataset[
              "b-OtrosGastosDeImportacion/ExportacionSubDatas"
            ] ?? []
          }
          columns={columns(procedureDataset.procedureId, "botrosgastos")}
        />
      </section>
      <section>
        <AddPayrollSubDataForm
          urlLabel="cgastosdeoperaciones"
          procedureId={procedureDataset.procedureId}
          fieldId={533}
        />
        <div>c|Gastos de Operaciones</div>
        <DataTable
          data={procedureDataset["c-GastosDeOperacionesSubDatas"] ?? []}
          columns={columns(
            procedureDataset.procedureId,
            "cgastosdeoperaciones"
          )}
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
        <AddPayrollSubDataForm
          urlLabel="dhonorariosProfesionales"
          procedureId={procedureDataset.procedureId}
          fieldId={534}
        />
        <div>d|Honorarios Profesionales</div>
        <DataTable
          data={procedureDataset["d-HonorariosProfesionalesSubDatas"] ?? []}
          columns={columns(
            procedureDataset.procedureId,
            "dhonorariosProfesionales"
          )}
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
