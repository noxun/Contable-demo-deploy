"use client"
import FormNewVoucher from "@/features/accounting/shared/components/FormNewVoucher";
import { VoucherType, VoucherTypeRoute } from "@/features/accounting/shared/types/sharedTypes";

export default function NewExpensePage() {
  return (
    <div className="px-6">
      <h2 className="text-lg font-bold">Formulario para crear egreso</h2>
      <FormNewVoucher routeType={VoucherTypeRoute.EXPENSE} type={VoucherType.EXPENSE}/>
    </div>
  );
};
