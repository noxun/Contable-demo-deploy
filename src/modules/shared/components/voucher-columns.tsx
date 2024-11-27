import { ColumnDef } from "@tanstack/react-table";
import { Voucher, VoucherType, VoucherTypeRoute } from "../types/sharedTypes";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Link from "next/link";
import VoucherDeleteButton from "./VoucherDeleteButton";
import PdfVoucher from "./PdfVoucher";
import { format } from "date-fns";

export function columns(
  voucherType: VoucherType,
  voucherTypeRoute: VoucherTypeRoute
): ColumnDef<Voucher>[] {
  return [
    {
      accessorKey: "num",
      header: "Nro",
    },
    {
      accessorKey: "voucherDate",
      header: "Fecha",
      cell: ({row}) => {
        return format(row.getValue("voucherDate"), "yyyy-MM-dd");
      }
    },
    {
      accessorKey: "bankId",
      header: "Banco",
    },
    {
      accessorKey: "coin",
      header: "Moneda",
    },
    {
      accessorKey: "gloss",
      header: "Glosa",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const voucher = row.original;
        return (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/${voucherTypeRoute}/${voucher.id}/edit`}
                  >
                    Editar
                  </Link>
                </DropdownMenuItem>
                {/* sería interesante probar también con asChild */}
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  {/* <Link href={`/dashboard/${voucherTypeRoute}/${voucher.id}/pdf`}>Reporte</Link> */}
                  <PdfVoucher id={voucher.id!} type={voucherType}/>
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    <span>Eliminar</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Esta absolutamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no puede revertirse. Esto borrara permanentemente
                  el voucher con id: {voucher.id}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <VoucherDeleteButton
                    voucherType={voucherType}
                    id={voucher!.id!}
                  >
                    Eliminar
                  </VoucherDeleteButton>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];
}
