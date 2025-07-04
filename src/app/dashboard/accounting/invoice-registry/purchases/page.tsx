"use client";

import { DownloadPurchasesOrSellsTemplateButton } from "@/features/accounting/invoice-registry/components/DownloadPurchasesOrSellsTemplateButton";
import { DialogCreateOrUpdatePurchaseForm } from "@/features/accounting/invoice-registry/purchases/components/DialogCreateOrUpdatePurchaseForm";
import ListPurchases from "@/features/accounting/invoice-registry/purchases/components/ListPurchases";
import { UploadPurchaseTemplateDialog } from "@/features/accounting/invoice-registry/purchases/components/UploadPurchaseTemplateDialog";

export default function PurchasesPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Registro de Compras</h1>
      <div className="flex flex-col gap-4 p-4">
        <DownloadPurchasesOrSellsTemplateButton />
        <UploadPurchaseTemplateDialog />
        <DialogCreateOrUpdatePurchaseForm mode="create" />
      </div>
      <div className="overflow-x-auto">
        <ListPurchases />
      </div>
    </div>
  );
}
