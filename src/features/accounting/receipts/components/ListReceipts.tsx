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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recibos</h1>
        <CreateOrUpdateReceiptFormDialog mode="create" />
      </div>

      <DataTable columns={columns} data={receipts} />
    </div>
  );
}
