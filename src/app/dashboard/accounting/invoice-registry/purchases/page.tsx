"use client";

import { DialogGenerateSeats } from "@/features/accounting/invoice-registry/components/DialogGenerateSeats";
import { DialogCreateOrUpdatePurchaseForm } from "@/features/accounting/invoice-registry/purchases/components/DialogCreateOrUpdatePurchaseForm";
import { DownloadPurchaseTemplateButton } from "@/features/accounting/invoice-registry/purchases/components/DownloadPurchaseTemplateButton";
import ListPurchases from "@/features/accounting/invoice-registry/purchases/components/ListPurchases";
import { UploadPurchaseTemplateDialog } from "@/features/accounting/invoice-registry/purchases/components/UploadPurchaseTemplateDialog";
import { ButtonGenerateExcelReport } from "@/features/accounting/invoice-registry/components/ButtonGenerateExcelReport";
import { Suspense } from "react";

export default function PurchasesPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Registro de Compras</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <DownloadPurchaseTemplateButton />
        <UploadPurchaseTemplateDialog />
        <DialogCreateOrUpdatePurchaseForm mode="create" />
        <DialogGenerateSeats mode="purchase" />
        <Suspense fallback={<div>Cargando...</div>}>
          <ButtonGenerateExcelReport type="buy" />
        </Suspense>
      </div>
      <div className="overflow-x-auto">
        <Suspense fallback={<div>Cargando...</div>}>
          <ListPurchases />
        </Suspense>
      </div>
    </div>
  );
}
