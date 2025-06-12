"use client";
import { ListReceipts } from "@/features/accounting/receipts/components/ListReceipts";

export default function ReceiptsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recibos</h1>
      
      <ListReceipts />
    </div>
  );
}