"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { InvoiceRegistryType } from "@/lib/types";
import useInvoiceRegistryByType from "@/modules/shared/hooks/useInvoiceRegistryByType";

export default function ListInvoiceRegistry({
  type,
}: {
  type: InvoiceRegistryType;
}) {

  const {
    data: invoiceRegistries,
    isLoading,
    isError,
  } = useInvoiceRegistryByType(type);

  return (
    <>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <DataTable data={invoiceRegistries ?? []} columns={columns} />
      )}
    </>
  );
}
