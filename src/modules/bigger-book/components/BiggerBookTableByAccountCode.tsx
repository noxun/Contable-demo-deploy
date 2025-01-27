import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useBiggerBookDataByAccountCode from "@/modules/shared/hooks/useBiggerBookDataByAccountCode";
import EditVoucherDialog from "@/modules/shared/components/EditVoucherDialog";

type BookBiggerData = {
  accountCode: string;
  accountDescription: string;
  totalDebit: number;
  totalAsset: number;
  totalDebitSus: number;
  totalAssetSus: number;
  totalSaldoNum: number;
  totalSaldoNumSus: number;
  totalSaldoText: string;
  totalSaldoTextSus: string;
  literal: any;
  voucherItems: Array<{
    id: number;
    debitBs: number;
    debitSus: number;
    assetBs: number;
    assetSus: number;
    totalSaldoBs: number;
    totalSaldoSus: number;
    gloss: string;
    accountId: number;
    code: string;
    description: string;
    typeOfExpense: any;
    createdAt: string;
    voucherId: number;
    type: number;
    typeDes: string;
    hojaDeRuta?: string;
  }>;
};

interface BiggerBookTableProps {
  accountCode: string;
}

export const BiggerBookTable = ({ accountCode }: BiggerBookTableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const {
    data: bookData,
    isLoading,
    error,
  } = useBiggerBookDataByAccountCode(accountCode, true);

  const columns: ColumnDef<BookBiggerData["voucherItems"][0]>[] = [
    {
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "typeDes",
      header: "Tipo",
    },
    {
      accessorKey: "voucherId",
      header: "N° Doc",
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "gloss",
      header: "Glosa",
      filterFn: "includesString",
    },
    {
      accessorKey: "hojaDeRuta",
      header: "Hoja Ruta",
    },
    {
      accessorKey: "debitBs",
      header: "Debe Bs",
      cell: ({ row }) => {
        return (row.getValue("debitBs") as number).toLocaleString("es-BO", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      accessorKey: "assetBs",
      header: "Haber Bs",
      cell: ({ row }) => {
        return (row.getValue("assetBs") as number).toLocaleString("es-BO", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      accessorKey: "totalSaldoBs",
      header: "Saldo Bs",
      cell: ({ row }) => {
        return (row.getValue("totalSaldoBs") as number).toLocaleString(
          "es-BO",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <EditVoucherDialog
            id={item.voucherId}
            type={item.type}
            accountCode={accountCode}
            // accountDate={new Date().toISOString()}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: bookData?.[0]?.voucherItems ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Error al cargar los datos
      </div>
    );
  }

  if (!bookData?.[0]) {
    return <div className="text-center py-4">No se encontraron datos</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Buscar por glosa..."
          value={(table.getColumn("gloss")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("gloss")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Total Debe:{" "}
          {bookData[0].totalDebit.toLocaleString("es-BO", {
            minimumFractionDigits: 2,
          })}{" "}
          Bs
          <br />
          Total Haber:{" "}
          {bookData[0].totalAsset.toLocaleString("es-BO", {
            minimumFractionDigits: 2,
          })}{" "}
          Bs
          <br />
          Saldo:{" "}
          {bookData[0].totalSaldoNum.toLocaleString("es-BO", {
            minimumFractionDigits: 2,
          })}{" "}
          Bs
        </div>
      </div>

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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BiggerBookTable;
