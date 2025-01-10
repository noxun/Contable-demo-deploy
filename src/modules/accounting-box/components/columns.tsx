import { AccountingBoxItems } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<AccountingBoxItems>[] = [
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => {
      const accountingBox = row.original;
      const date = new Date(accountingBox.fecha);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "hojaDeRuta",
    header: "Hoja de Ruta",
  },
  {
    accessorKey: "referencia",
    header: "Referencia",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "detalle",
    header: "Detalle",
  },
  {
    accessorKey: "valorPagado",
    header: () => <div className="text-right">Valor Pagado</div>,
    cell: ({ row }) => {
      const accountingBox = row.original;
      return <div className="text-right">{accountingBox.valorPagado}</div>;
    },
  },
  // {
  //   id: "actions",
  //   header: "Acciones",
  //   cell: ({ row }) => {
  //     const modelSeat = row.original;
  //     return (
  //       <div className="flex justify-center gap-4 items-center">
  //         <EditModelSeatButton modelSeat={modelSeat}/>
  //         {/* <DeleteModelSeatDialog/> */}
  //       </div>
  //     );
  //   },
  // },
];
