"use client";

import ListVouchers from "@/features/accounting/vouchers/components/ListVouchers";
import {
  VoucherType,
  VoucherTypeRoute,
} from "@/features/accounting/shared/types/sharedTypes";

export default function PurchasesListPage() {
  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Lista de Compras</h2>
      </div>
      <ListVouchers
        voucherType={VoucherType.EXPENSE}
        voucherTypeRoute={VoucherTypeRoute.EXPENSE}
        glossSuffix="por la compra"
      />
    </section>
  );
}
