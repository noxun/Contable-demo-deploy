"use client";

import { DataTable } from "@/components/ui/data-table";
import useBankExtractPaymentFilesById from "@/modules/shared/hooks/useBankExtractPaymentFilesById";
import { columns } from "./bank-excerpt-payment-files-columns";

export default function ListRegisteredPayments({
  bankExtractId,
}: {
  bankExtractId: number;
}) {
  const {
    data: paymentFiles,
    isLoading,
    isError,
  } = useBankExtractPaymentFilesById(bankExtractId);

  if (isError) {
    return <div>Hubo un error al obtener los archivos</div>;
  }

  if (isLoading && !paymentFiles) {
    return <div>Cargando...</div>;
  }

  return <DataTable data={paymentFiles ?? []} columns={columns} />;
}
