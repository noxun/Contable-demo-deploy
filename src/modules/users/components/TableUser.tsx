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
import EditUser from "./EditUser";
import { useState } from "react";
import { IUserResponse } from "../interface/users";

export const TableUser = (props: { data: IUserResponse[] }) => {
  const { data } = props;
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserResponse | null>(null);

  const openEditUser = (user: IUserResponse) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const closeEditUser = () => {
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  const columns: ColumnDef<IUserResponse>[] = [
    {
      accessorKey: "name",
      header: "Nombre Completo",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div>{`${user.name} ${user.fatherLastName} ${user.motherLastName}`}</div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Correo",
    },
    {
      accessorKey: "username",
      header: "Nombre de usuario",
    },
    {
      accessorKey: "status",
      header: "Estado",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => openEditUser(user)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      {selectedUser && (
        <EditUser
          isOpen={isEditUserOpen}
          onClose={closeEditUser}
          user={selectedUser}
        />
      )}
    </div>
  );
};
