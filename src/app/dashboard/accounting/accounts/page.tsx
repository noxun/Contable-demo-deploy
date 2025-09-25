"use client";

import { Button } from "@/components/ui/button";
import AccountAccordion from "@/features/accounting/account/components/AccountAccordion";
import { AccountExportToExcelButton } from "@/features/accounting/account/components/AccountExportToExcelButton";
import Link from "next/link";

export default function AccountsPage() {
  return (
    <main className="flex flex-col gap-4">
      <Button asChild>
        <Link
          prefetch={false}
          download
          href="/files/plantilla_plan_de_cuentas.xlsx"
        >
          Descargar Plantilla
        </Link>
      </Button>
      <AccountExportToExcelButton />
      <AccountAccordion />
    </main>
  );
}
