"use client";

import ListVouchers from "@/features/accounting/vouchers/components/ListVouchers";
import { Suspense } from "react";

export default function TransactionsPage() {
  return (
    <section className="px-6">
      <Suspense fallback={<div>Cargando...</div>}>
        <ListVouchers />
      </Suspense>
    </section>
  );
}
