"use client";

import { DataTable } from "@/components/ui/data-table";
import { useReceipts } from "../hooks/useReceipts";
import { CreateOrUpdateReceiptFormDialog } from "./CreateOrUpdateReceiptFormDialog";
import { columns } from "./columns";

import { fakeReceipts } from "./FakeData_Receipts";

export function ListReceipts() {
  // const { data: receipts, isLoading } = useReceipts();

  // if (isLoading || !receipts) {
  //   return <div>Cargando recibos...</div>;
  // }

  return <DataTable columns={columns} data={fakeReceipts} />;  //cambiar a data={receipts} | cuando este disponible
}
