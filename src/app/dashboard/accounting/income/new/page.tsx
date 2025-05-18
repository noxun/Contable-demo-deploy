"use client"
import FormNewVoucher from "@/features/accounting/shared/components/FormNewVoucher";
import {
  VoucherType,
  VoucherTypeRoute,
} from "@/features/accounting/shared/types/sharedTypes";

export default function NewIncomePage() {
  return (
    <div className="px-6">
      <h2 className="text-lg font-bold">Formulario para crear transacción</h2>
      <FormNewVoucher
        routeType={VoucherTypeRoute.INCOME}
        type={VoucherType.INCOME}
      />
    </div>
  );
}
