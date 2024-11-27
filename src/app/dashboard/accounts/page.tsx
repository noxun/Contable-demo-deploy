"use client";

import { Button } from "@/components/ui/button";
import AccountAccordion from "@/modules/account/components/AccountAccordion";
import Link from "next/link";

export default function AccountsPage() {
  return (
    <>
      <Button asChild>
        <Link download href="/files/plan_cuentas_tradecruz.xlsx">
          Descargar Plantilla
        </Link>
      </Button>
      <AccountAccordion />
    </>
  );
}
