import { Button } from "@/components/ui/button";
import ListVouchers from "@/modules/shared/components/ListVouchers";
import { VoucherType, VoucherTypeRoute } from "@/modules/shared/types/sharedTypes";
import Link from "next/link";

export default function IncomesPage() {
  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Ingresos</h2>
        <Link href="/dashboard/accounting/income/new">
          <Button>Nuevo Ingreso</Button>
        </Link>
      </div>
      {/* <ListVouchers voucherType={VoucherType.INCOME} voucherTypeRoute={VoucherTypeRoute.INCOME}/> */}
    </section>
  );
};