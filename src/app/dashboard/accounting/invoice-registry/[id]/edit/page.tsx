"use client";
import { fetchSingleInvoiceRegistryById } from "@/lib/data";
import FormEditInvoiceRegistry from "@/features/accounting/invoice-registry/components/FormEditInvoiceRegistry";
import { useQuery } from "@tanstack/react-query";

export default function EditInvoiceRegistryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const {
    data: invoiceRegistry,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["invoiceRegistry","edit", id],
    queryFn: () => fetchSingleInvoiceRegistryById(parseInt(id)),
  });

  if (isError) {
    return <div>Hubo un error al obtener los datos</div>;
  }

  if (isLoading || invoiceRegistry === undefined) {
    return <div>Cargando...</div>;
  }

  return <FormEditInvoiceRegistry invoiceRegistry={invoiceRegistry} />;
}
