import { InvoiceRegistry } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<InvoiceRegistry>[] = [
  {
    accessorKey: "nitProvider",
    header: "NIT del Proveedor",
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
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
