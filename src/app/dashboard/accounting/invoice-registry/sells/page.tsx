"use client"
import { Button } from "@/components/ui/button";
import DownloadMassPurchaseFormButton from "@/features/accounting/invoice-registry/components/DownloadMassTransactionFormButton";
import ImportInvoiceRegistryDialog from "@/features/accounting/invoice-registry/components/ImportInvoiceRegistryDialog";
import ListInvoiceRegistry from "@/features/accounting/invoice-registry/components/ListInvoiceRegistry";
import Link from "next/link";

export default function InvoiceRegistrySellsPage() {
  const sells = 1;
  return (
    <main className="overflow-x-visible space-y-4">
      <h1>Registro de Ventas</h1>
      <div className="flex gap-6">
        <Button asChild>
          <Link href="/dashboard/accounting/invoice-registry/new">Nueva Registro</Link>
        </Button>
        <DownloadMassPurchaseFormButton type={sells}/>
        <ImportInvoiceRegistryDialog/>
      </div>
      <ListInvoiceRegistry type={sells}/>
    </main>
  )
}
