"use client";
import { Button } from "@/components/ui/button";
import { SIAT_TEMPLATE_LINK } from "@/lib/constants";
import Link from "next/link";

export function DownloadPurchasesOrSellsTemplateButton() {
  return (
    <Button asChild>
      <Link href={SIAT_TEMPLATE_LINK} prefetch={false} target="_blank">
        Descargar Plantilla
      </Link>
    </Button>
  );
}
