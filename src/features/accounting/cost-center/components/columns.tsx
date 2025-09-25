import { CostCenter } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<CostCenter>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey:"descripcion",
    header: "Descripción"
  },
  {
    accessorKey: "account",
    header: "Cuenta",
  },
  {
    accessorKey: "diaryVouchers",
    header: "Diarios",
  },
  {
    accessorKey: "egressVouchers",
    header: "Egresos",
  },{
    accessorKey: "incomeVouchers",
    header: "Ingresos",
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
