"use client";

import { DataTable } from "@/components/ui/data-table";
import useInvoiceRegistry from "@/modules/shared/hooks/useInvoiceRegistry";
import { columns } from "./columns";

export default function ListInvoiceRegistry() {
  const { data: invoiceRegistries, isLoading, isError } = useInvoiceRegistry();

  return (
    <>
      {isLoading  ? <div>Cargando...</div> : (
        <DataTable data={invoiceRegistries ?? []} columns={columns} />
      )}
    </>
  );
}
