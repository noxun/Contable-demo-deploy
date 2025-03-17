import { Button } from "@/components/ui/button";
import ListModelSeats from "@/modules/model-seats/components/ListModelSeats";
import Link from "next/link";

export default function ModelSeatsPage() {
  return (
    <main className="flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Asientos Modelo</h1>
        <Button asChild>
          <Link href="/dashboard/accounting/model-seats/new">Crear Asiento Modelo</Link>
        </Button>
      </div>
      <ListModelSeats />
    </main>
  );
}
