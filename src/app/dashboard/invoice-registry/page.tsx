import { Button } from "@/components/ui/button";
import DownloadMassPurchaseFormButton from "@/modules/invoice-registry/components/DownloadMassPurchaseFormButton";
import ListInvoiceRegistry from "@/modules/invoice-registry/components/ListInvoiceRegistry";
import Link from "next/link";

export default function InvoiceRegistryPage() {
  return (
    <main className="overflow-x-visible">
      <div className="flex gap-6">
        <Button asChild>
          <Link href="/dashboard/invoice-registry/new">Nueva Registro</Link>
        </Button>
        <DownloadMassPurchaseFormButton/>
      </div>
      <ListInvoiceRegistry/>
    </main>
  )
}
