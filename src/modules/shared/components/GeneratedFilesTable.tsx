import { DataTable } from "@/components/ui/data-table";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";

export const GeneratedFilesTable = React.memo(({ data, nameFile }: { data: any[], nameFile: string }) => {

  const columns = [
    { header: "Tipo", accessorKey: "type" },
    { header: "Fecha", accessorKey: "date" },
    {
      header: "Enlace",
      accessorKey: "link",
      cell: ({ row }: any) => {
        const file = row.original.link
        return (
          (
            <PDFDownloadLink
              document={file}
              fileName={`${nameFile}_${row.original.date}.pdf`}
            >
              Descargar
            </PDFDownloadLink>
          )
        )
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
});

GeneratedFilesTable.displayName = "GeneratedFilesTable";
