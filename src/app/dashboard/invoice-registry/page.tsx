import { Button } from "@/components/ui/button";
import ListInvoiceRegistry from "@/modules/invoice-registry/components/ListInvoiceRegistry";
import Link from "next/link";

export default function InvoiceRegistryPage() {
  return (
    <main className="overflow-x-visible">
      <Button asChild>
        <Link href="/dashboard/invoice-registry/new">Nueva Registro</Link>
      </Button>
      <ListInvoiceRegistry/>
    </main>
  )
}
