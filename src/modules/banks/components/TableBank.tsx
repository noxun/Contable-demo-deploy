"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import EditBank from "./EditBank";
import { useState } from "react";
import { IBank } from "../interface/banks";
import DialogNewExcerpt from "./DialogNewExcerpt";
import DialogExcerptTable from "./DialogExcerptTable";
import Link from "next/link";

export const TableBank = (props: { data: IBank[] }) => {
  const { data } = props;
  const [isEditBankOpen, setIsEditBankOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<IBank | null>(null);

  const openEditBank = (bank: IBank) => {
    setSelectedBank(bank);
    setIsEditBankOpen(true);
  };

  const closeEditBank = () => {
    setIsEditBankOpen(false);
    setSelectedBank(null);
  };

  const columns: ColumnDef<IBank>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "descripcion",
      header: "descripcion",
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const bank = row.original;
        return (
          <>
          {/* <DialogExcerptTable bankId={bank.id}/> */}
          <Button asChild><Link href={`/dashboard/banks/${bank.id}/${bank.name}/extracts`}>Ver Extractos</Link></Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => openEditBank(bank)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogNewExcerpt bankId={bank.id}/>
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedBank && (
        <EditBank
          isOpen={isEditBankOpen}
          onClose={closeEditBank}
          bank={selectedBank}
        />
      )}
    </div>
  );
};
