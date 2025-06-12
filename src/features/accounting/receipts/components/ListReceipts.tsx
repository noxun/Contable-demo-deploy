"use client";

import { DataTable } from "@/components/ui/data-table";
import { useReceipts } from "../hooks/useReceipts";
import { CreateOrUpdateReceiptFormDialog } from "./CreateOrUpdateReceiptFormDialog";
import { columns } from "./columns";

export function ListReceipts() {
  const { data: receipts, isLoading } = useReceipts();

  if (isLoading || !receipts) {
    return <div>Cargando recibos...</div>;
  }

  return <DataTable columns={columns} data={receipts} />;
}
