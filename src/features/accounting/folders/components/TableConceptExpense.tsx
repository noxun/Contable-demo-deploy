"use client";
import { IResponseConceptFolder } from "../interface/folders";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface Props {
  numRef: string;
  data: IResponseConceptFolder[] | undefined;
}

export const TableConceptExpense = ({ numRef, data }: Props) => {
  function columns(): ColumnDef<IResponseConceptFolder>[] {
    return [
      {
        accessorKey: "acronym",
        header: "Sigla",
      },
      {
        accessorKey: "description",
        header: "Descripción",
      },
      {
        accessorKey: "typeOfExpense",
        header: "Tipo",
      },
      {
        accessorKey: "debitBs",
        header: "Pago",
        cell: ({ row }) => {
          const conceptFolder = row.original;
          return (
            <div className="flex gap-2">
              {conceptFolder.typeOfExpense === "Factura"
                ? conceptFolder.assetBs
                : conceptFolder.debitBs}
            </div>
          );
        },
      },
    ];
  }

  return (
    <div>
      <DataTable columns={columns()} data={data ?? []} />
    </div>
  );
};
