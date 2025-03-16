import { Button } from "@/components/ui/button";
import ListVouchers from "@/modules/shared/components/ListVouchers";
import { VoucherType, VoucherTypeRoute } from "@/modules/shared/types/sharedTypes";
import Link from "next/link";

import dynamic from "next/dynamic";

const DynamicListVouchers = dynamic(()=> import("@/modules/shared/components/ListVouchers"), {
  loading: () => <div>Cargando...</div>,
  ssr: false
})

export default function DiariesPage() {
  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Diarios</h2>
        <Link href="/dashboard/accounting/diary/new">
          <Button>Nuevo Diario</Button>
        </Link>
      </div>
      <DynamicListVouchers voucherType={VoucherType.DIARY} voucherTypeRoute={VoucherTypeRoute.DIARY}/>
    </section>
  );
};