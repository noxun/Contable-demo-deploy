"use client";

import ListVouchers from "@/features/accounting/shared/components/ListVouchers";
import {
  VoucherType,
  VoucherTypeRoute,
} from "@/features/accounting/shared/types/sharedTypes";

export default function SellsListPage() {
  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Lista de Ventas</h2>
      </div>
      <ListVouchers
        voucherType={VoucherType.INCOME}
        voucherTypeRoute={VoucherTypeRoute.INCOME}
        glossSuffix="por la venta"
      />
    </section>
  );
}
