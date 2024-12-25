import { ColumnDef } from "@tanstack/react-table";
import { Voucher, VoucherType, VoucherTypeRoute } from "../types/sharedTypes";
import { MoreHorizontal, Pencil } from "lucide-react";
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
import DeleteVoucherDialog from "./DeleteVoucherDialog";

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
      cell: ({ row }) => {
        return format(row.getValue("voucherDate"), "yyyy-MM-dd");
      },
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
      header: "Acciones",
      enableHiding: false,
      cell: ({ row }) => {
        const voucher = row.original;
        return (
          <div className="flex items-center justify-between">
            <DeleteVoucherDialog
              voucherId={voucher.id!}
              voucherType={voucher.type?.toString() as VoucherType}
            />
            <Button asChild variant="outline" size="icon">
              <Link href={`/dashboard/${voucherTypeRoute}/${voucher.id}/edit`}>
                <Pencil className="size-4" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                {/* sería interesante probar también con asChild */}
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <PdfVoucher id={voucher.id!} type={voucherType} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
