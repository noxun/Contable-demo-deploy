import { Button } from "@/components/ui/button";
import DownloadMassPurchaseFormButton from "@/modules/invoice-registry/components/DownloadMassTransactionFormButton";
import ImportInvoiceRegistryDialog from "@/modules/invoice-registry/components/ImportInvoiceRegistryDialog";
import ListInvoiceRegistry from "@/modules/invoice-registry/components/ListInvoiceRegistry";
import Link from "next/link";

export default function InvoiceRegistryPurchasesPage() {
  const purchase = 0;
  return (
    <main className="overflow-x-visible space-y-4">
      <h1>Registro de Compras</h1>
      <div className="flex gap-6">
        <Button asChild>
          <Link href="/dashboard/invoice-registry/new">Nuevo Registro</Link>
        </Button>
        <DownloadMassPurchaseFormButton type={purchase}/> 
        <ImportInvoiceRegistryDialog/>
      </div>
      <ListInvoiceRegistry type={purchase}/>
    </main>
  )
}
