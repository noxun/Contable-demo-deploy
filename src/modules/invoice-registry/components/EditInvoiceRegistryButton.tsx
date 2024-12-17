"use client"
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

export default function EditInvoiceRegistryButton({
  invoiceRegistryId,
}: {
  invoiceRegistryId: number;
}) {
  return (
    <Button asChild size="icon" variant="outline">
      <Link href={`/dashboard/invoice-registry/${invoiceRegistryId}/edit`}>
        <Pencil className="size-4" />
      </Link>
    </Button>
  );
}
