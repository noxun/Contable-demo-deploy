"use client";

import { DataTable } from "@/components/ui/data-table";
import { usePurchases } from "../hooks/usePurchases";
import { columns } from "./columns";
import InvoicesFilters from "../../components/InvoicesFilters";
import { useInvoiceFilters } from "../../hooks/useInvoiceFilters";
import { InvoicesPagination } from "../../components/InvoicesPagination";
import { DataTableWithColumnsToggle } from "@/components/ui/data-table-column-vis";

export default function ListPurchases() {
  const { data: purchases, isError, isLoading, isFetching } = usePurchases();
  const { setters } = useInvoiceFilters();

  if (isError) {
    return <div>Error al cargar las compras.</div>;
  }

  if (isLoading || !purchases) {
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
        <DataTableWithColumnsToggle data={purchases.data} columns={columns} />
      </div>
      <InvoicesPagination
        pagination={purchases.pagination}
        onPageChange={setters.setPageNumber}
        onPageSizeChange={(pageSize) => {
          setters.setPageSize(pageSize);
          setters.setPageNumber(1); // Reset to first page when page size changes
        }}
      />
    </>
  );
}
