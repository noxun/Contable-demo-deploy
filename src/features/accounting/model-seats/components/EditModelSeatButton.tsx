import { Button } from "@/components/ui/button";
import { ModelSeat } from "@/lib/types";
import { Pencil } from "lucide-react";
import Link from "next/link";

type EditModelSeatButtonProps = {
  modelSeat: ModelSeat;
};

export default function EditModelSeatButton({
  modelSeat,
}: EditModelSeatButtonProps) {
  return (
    <Button asChild size="icon" variant="outline">
      <Link href={`/dashboard/accounting/model-seats/${modelSeat.id}/edit`}>
        <Pencil className="size-4" />
      </Link>
    </Button>
  );
}
