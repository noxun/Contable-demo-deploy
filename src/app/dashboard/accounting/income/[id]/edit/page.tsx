import EditVoucher from "@/modules/shared/components/EditVoucher";
import { VoucherType } from "@/modules/shared/types/sharedTypes";

export default function EditIncomePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  return (
    <div className="px-5">
      <EditVoucher id={id} type={VoucherType.INCOME} />
    </div>
  );
}
