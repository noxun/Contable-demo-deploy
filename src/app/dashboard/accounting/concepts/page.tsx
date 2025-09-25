import { Button } from "@/components/ui/button";
import ListConcepts from "@/features/accounting/concepts/components/ListConcepts";
import Link from "next/link";

export default function ConceptsPage() {
  return (
    <main>
      <Button asChild className="mb-5">
        <Link href="/dashboard/accounting/concepts/new">Nuevo Concepto</Link>
      </Button>
      <ListConcepts/>
    </main>
  )
}
