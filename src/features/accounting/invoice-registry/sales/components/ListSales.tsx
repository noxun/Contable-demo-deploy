"use client";

import { DataTable } from "@/components/ui/data-table";
import { useSales } from "../hooks/useSales";
import { columns } from "./columns";
import InvoicesFilters from "../../components/InvoicesFilters";
import { useInvoiceFilters } from "../../hooks/useInvoiceFilters";
import { InvoicesPagination } from "../../components/InvoicesPagination";

export default function ListSales() {
  const { data: sales, isError, isLoading, isFetching } = useSales();
  const { setters } = useInvoiceFilters();

  if (isError) {
    return <div>Error al cargar las ventas.</div>;
  }

  if (isLoading || !sales) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <InvoicesFilters />
      <div className="relative">
        {isFetching && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <div className="text-sm text-muted-foreground">Cargando...</div>
          </div>
        )}
        <DataTable data={sales.data} columns={columns} />
      </div>
      <InvoicesPagination
        pagination={sales.pagination}
        onPageChange={setters.setPageNumber}
        onPageSizeChange={(pageSize) => {
          setters.setPageSize(pageSize);
          setters.setPageNumber(1); // Reset to first page when page size changes
        }}
      />
    </>
  );
}
