import { Button } from "@/components/ui/button";
import DownloadMassPurchaseFormButton from "@/modules/invoice-registry/components/DownloadMassTransactionFormButton";
import ListInvoiceRegistry from "@/modules/invoice-registry/components/ListInvoiceRegistry";
import Link from "next/link";

//this is the old default page
export default function InvoiceRegistryPage() {
  const sells = 1;
  return (
    <main className="overflow-x-visible">
      {/* <div className="flex gap-6">
        <Button asChild>
          <Link href="/dashboard/invoice-registry/new">Nueva Registro</Link>
        </Button>
        <DownloadMassPurchaseFormButton/>
      </div>
      <ListInvoiceRegistry type={sells}/> */}
      <h1>Pagina antigua de todos los registros de compras y ventas</h1>
    </main>
  );
}
