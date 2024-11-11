import { AccountingBoxItems } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<AccountingBoxItems>[] = [
  {
    accessorKey: "mes",
    header: "Mes",
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
  },
  {
    accessorKey: "reciboInterno",
    header: "Recibo Interno",
  },
  {
    accessorKey: "tipoComprobante",
    header: "Tipo Comprobante",
  },
  {
    accessorKey: "comprobanteProveedor",
    header: "Proveedor",
  },
  {
    accessorKey: "hojaDeRuta",
    header: "Hoja de Ruta",
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
  },
  {
    accessorKey: "detalle",
    header: "Detalle",
  },
  {
    accessorKey: "ingreso",
    header: "Ingreso",
  },
  {
    accessorKey: "egreso",
    header: "Egreso",
  },
  {
    accessorKey: "saldo",
    header: "Saldo",
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
