"use client"

import * as React from "react"
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
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface FilterProps {
  columnName: string;
  placeholder?: string;
  type?: "text" | "number" | "month" | "date";
}
type ColumnDefWithFixed<TData, TValue> = ColumnDef<TData, TValue> & {
  isSticky?: boolean;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDefWithFixed<TData, TValue>[]
  data: TData[],
  filter?: FilterProps
  fixedId?: boolean
}

export function DataTablePayrollsSalaries<TData, TValue>({
  columns,
  data,
  filter,
  fixedId
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 py-4 items-center justify-center">
        <div className="order-1 flex justify-start">
          {filter && filter.columnName && (
            <Input
              type={filter.type}
              placeholder={filter.placeholder}
              value={(table.getColumn(filter.columnName)?.getFilterValue() as string) || ""}
              onChange={(event) => {
                const selectedMonth = event.target.value;
                table.getColumn(filter.columnName)?.setFilterValue(selectedMonth);
              }}
              className="w-fit"
            />
          )}
        </div>
        <div className="order-3 lg:order-2 col-span-2 lg:col-span-1 flex items-center justify-center space-x-2 py-4">
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex gap-1 items-center justify-center pl-2"
          >
            <ChevronLeftIcon /> Prev
          </Button>
          <div>
            Tabla {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex gap-1 items-center justify-center pr-2"
          >
            Next <ChevronRightIcon />
          </Button>
        </div>
        <div className="order-2 lg:order-3 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(
                  (column) => column.getCanHide()
                )
                .map((column) => {
                  const name = column.columnDef.header
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize py-0 pb-2"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {name ? name.toString() : ''}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative rounded-md mx-auto border w-[90vw] md:w-[69vw] lg:w-full max-h-[90vh] max-w-full overflow-auto">
        <Table>
          <TableHeader className="sticky inset-0 z-20 bg-[#2563eb] hover:bg-[#2563eb]/90">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const isSticky = (header.column.columnDef as ColumnDefWithFixed<TData, TValue>).isSticky;

                  return (
                    <React.Fragment key={`col-${header.id}`}>
                      {
                        fixedId && index === 0 && (
                          <TableHead
                            className={`${fixedId ? 'sticky left-0 z-30 bg-[#ececec] text-[#2563eb]' : 'text-[#ececec]'}`}
                          >
                            Nro
                          </TableHead>
                        )
                      }
                      <TableHead
                        className={`${isSticky ? 'sticky left-0 z-30 bg-[#ececec] text-[#2563eb]' : 'text-[#ececec]'}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    </React.Fragment>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => {

                    const isSticky = (cell.column.columnDef as ColumnDefWithFixed<TData, TValue>).isSticky;

                    return (
                      <React.Fragment key={`cell-${cell.id}`}>
                        {
                          fixedId && index === 0 && (
                            <TableCell
                              className={`${fixedId ? 'sticky left-0 z-10 bg-[#2563eb] text-[#ececec]' : ''}`}
                            >
                              {rowIndex + 1}
                            </TableCell>
                          )
                        }
                        <TableCell
                          className={`${isSticky ? 'sticky left-0 z-10 bg-[#2563eb] text-[#ececec]' : ''}`}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      </React.Fragment>
                    )
                  }
                  )}
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
      </div>
    </div>
  )
}
