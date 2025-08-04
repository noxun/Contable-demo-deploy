"use client";

import { FormCreateOrUpdateVoucher } from "@/features/accounting/vouchers/components/FormCreateOrUpdateVoucher";

export default function VoucherTestPage() {
  return <FormCreateOrUpdateVoucher mode="create" />;
  // return <FormCreateOrUpdateVoucher mode="update" voucherId={2077} type="1" />;
}
