import { Button } from "@/components/ui/button";
import ListVouchers from "@/modules/shared/components/ListVouchers";
import { VoucherType, VoucherTypeRoute } from "@/modules/shared/types/sharedTypes";
import Link from "next/link";

export default function ExpensesPage() {
  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Egresos</h2>
        <Link href="/dashboard/expenses/new">
          <Button>Nuevo Egreso</Button>
        </Link>
      </div>
      <ListVouchers voucherType={VoucherType.EXPENSE} voucherTypeRoute={VoucherTypeRoute.EXPENSE}/>
    </section>
  );
};

