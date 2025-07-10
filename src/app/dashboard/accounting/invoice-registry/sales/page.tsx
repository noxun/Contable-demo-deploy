"use client";

import { DialogGenerateSeats } from "@/features/accounting/invoice-registry/components/DialogGenerateSeats";
import { DialogCreateOrUpdateSaleForm } from "@/features/accounting/invoice-registry/sales/components/DialogCreateOrUpdateSaleForm";
import { DownloadSalesTemplateButton } from "@/features/accounting/invoice-registry/sales/components/DownloadSalesTemplateButton";
import ListSales from "@/features/accounting/invoice-registry/sales/components/ListSales";
import { UploadSaleTemplateDialog } from "@/features/accounting/invoice-registry/sales/components/UploadSaleTemplateDialog";

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Registro de Compras</h1>
      <div className="grid grid-cols-2 gap-4 p-4">
        <DownloadSalesTemplateButton />
        <UploadSaleTemplateDialog />
        <DialogCreateOrUpdateSaleForm mode="create" />
        <DialogGenerateSeats mode="sale" />
      </div>
      <div className="overflow-x-auto">
        <ListSales />
      </div>
    </div>
  );
}
