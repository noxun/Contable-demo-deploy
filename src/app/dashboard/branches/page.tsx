import { Button } from "@/components/ui/button";
import ListBranches from "@/modules/branches/components/ListBranches";
import Link from "next/link";

export default function BranchesPage() {
  return (
    <main className="flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sucursales</h1>
        <Button asChild>
          <Link href="/dashboard/branches/new">Crear Sucursales</Link>
        </Button>
      </div>
      <ListBranches />
    </main>
  );
}
