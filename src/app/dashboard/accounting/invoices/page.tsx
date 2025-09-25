import { ListInvoices } from "@/features/accounting/invoices/components/ListInvoices";

const InvoicesPage = () => {
  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Lista de carpetas</h2>
      </div>
      <ListInvoices />
    </section>
  );
};

export default InvoicesPage;
