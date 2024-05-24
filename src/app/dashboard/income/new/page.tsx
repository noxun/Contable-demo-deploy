import FormNewVoucher from "@/modules/shared/components/FormNewVoucher";
import { VoucherType, VoucherTypeRoute } from "@/modules/shared/types/sharedTypes";

export default function NewIncomePage() {
  return (
    <div className="px-6">
      <h2 className="text-lg font-bold">Formulario para crear ingreso</h2>
      <FormNewVoucher routeType={VoucherTypeRoute.INCOME} type={VoucherType.INCOME}/>
    </div>
  );
};
