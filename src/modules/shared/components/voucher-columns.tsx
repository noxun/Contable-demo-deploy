import { ColumnDef } from "@tanstack/react-table";
import { Voucher, VoucherType, VoucherTypeRoute } from "../types/sharedTypes";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/alert-dialog"

import Link from "next/link";
import VoucherDeleteButton from "./VoucherDeleteButton";
import PdfVoucher from "./PdfVoucher";

export function columns(voucherType: VoucherType, voucherTypeRoute: VoucherTypeRoute): ColumnDef<Voucher>[] {
  return [
    {
      accessorKey: "num",
      header: "Nro",
    },
    {
      accessorKey: "canceledTo",
      header: "Fecha",
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
                  <Link href={`/dashboard/${voucherTypeRoute}/${voucher.id}/edit`}>Editar</Link>
                </DropdownMenuItem>
                {/* seria interesante probar tambien con asChild */}
                <DropdownMenuItem onSelect={(e) => { e.preventDefault() }}>
                  {/* <Link href={`/dashboard/${voucherTypeRoute}/${voucher.id}/pdf`}>Reporte</Link> */}
                  <PdfVoucher id={voucher.id!}/>
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
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  income with id {voucher.id} and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild><VoucherDeleteButton voucherType={voucherType} id={voucher!.id}>Eliminar</VoucherDeleteButton></AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];
}
