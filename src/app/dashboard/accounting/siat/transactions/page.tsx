"use client"; // Esto convierte el componente en un Client Component
import SyncAccountsButton from "@/features/accounting/link/components/SyncAccountsButton";
import ListVouchers from "@/features/accounting/vouchers/components/ListVouchers";
import { Suspense } from "react";

export default function SiatTransactionsPage() {
  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <SyncAccountsButton />
        <h2 className="text-lg font-semibold">Transacciones Siat</h2>
      </div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ListVouchers siat="siat" />
      </Suspense>
    </section>
  );
}
