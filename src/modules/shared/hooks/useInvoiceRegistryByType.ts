import { fetchInvoiceRegistryByType } from "@/lib/data";
import { InvoiceRegistryType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useInvoiceRegistryByType(type: InvoiceRegistryType) {
  return useQuery({
    queryKey: ["invoiceRegistry", type],
    queryFn: () => fetchInvoiceRegistryByType(type)
  });
}
