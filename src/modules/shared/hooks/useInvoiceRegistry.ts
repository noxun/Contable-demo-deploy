import { fetchInvoiceRegistryList } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useInvoiceRegistry() {
  return useQuery({
    queryKey: ["invoiceRegistry"],
    queryFn: fetchInvoiceRegistryList
  })
}