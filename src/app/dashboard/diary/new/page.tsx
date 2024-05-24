import FormNewVoucher from "@/modules/shared/components/FormNewVoucher";
import {
  VoucherType,
  VoucherTypeRoute,
} from "@/modules/shared/types/sharedTypes";

export default function NewDiaryPage() {
  return (
    <div className="px-6">
      <h2 className="text-lg font-bold">Formulario para crear un diario</h2>
      <FormNewVoucher
        type={VoucherType.DIARY}
        routeType={VoucherTypeRoute.DIARY}
      />
    </div>
  );
}
