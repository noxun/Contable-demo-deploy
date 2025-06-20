"use client";

import { DataTable } from "@/components/ui/data-table";
import { useReceipts } from "../hooks/useReceipts";
import { CreateOrUpdateReceiptFormDialog } from "./CreateOrUpdateReceiptFormDialog";
import { columns } from "./columns";

import { fakeReceipts } from "../utils/mock";

export function ListReceipts() {
  const { data: receipts, isLoading } = useReceipts();

  if (isLoading) {
    return <div>Cargando recibos...</div>;
  }

  const dataToShow = (receipts && receipts.length > 0) ? receipts : fakeReceipts;

  return <DataTable columns={columns} data={dataToShow} />; 
}
