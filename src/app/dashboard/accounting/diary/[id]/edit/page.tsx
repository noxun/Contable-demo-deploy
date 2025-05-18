import EditVoucher from "@/features/accounting/shared/components/EditVoucher";
import { VoucherType } from "@/features/accounting/shared/types/sharedTypes";

export default function EditDiaryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  return (
    <div className="px-5">
      <EditVoucher id={id} type={VoucherType.DIARY} />
    </div>
  );
}
