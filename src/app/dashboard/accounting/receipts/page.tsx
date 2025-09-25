"use client";
import { CreateOrUpdateReceiptFormDialog } from "@/features/accounting/receipts/components/CreateOrUpdateReceiptFormDialog";
import { ListReceipts } from "@/features/accounting/receipts/components/ListReceipts";

export default function ReceiptsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recibos</h1>
        <CreateOrUpdateReceiptFormDialog mode="create" />
      </div>
      <ListReceipts />
    </div>
  );
}
