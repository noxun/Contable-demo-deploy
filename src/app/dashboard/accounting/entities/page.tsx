import { Button } from "@/components/ui/button";
import ListEntities from "@/features/accounting/entities/components/ListEntities";
import Link from "next/link";

export default function EntitiesPage() {
  return (
    <main>
      {/* <Button asChild className="mb-5">
        <Link href="/dashboard/accounting/entities/new">Nueva Entidad</Link>
      </Button> */}
      <ListEntities/>
    </main>
  )
}
