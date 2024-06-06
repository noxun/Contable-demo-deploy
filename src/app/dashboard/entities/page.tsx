import { Button } from "@/components/ui/button";
import ListEntities from "@/modules/entities/components/ListEntities";
import Link from "next/link";

export default function EntitiesPage() {
  return (
    <main>
      <Button asChild>
        <Link href="/dashboard/entities/new">Nueva Entidad</Link>
      </Button>
      <ListEntities/>
    </main>
  )
}
