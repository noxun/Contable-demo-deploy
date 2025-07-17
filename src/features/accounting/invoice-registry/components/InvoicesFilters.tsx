"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import { useInvoiceFilters } from "../hooks/useInvoiceFilters";

export default function InvoicesFilters() {
  const { filters, setters } = useInvoiceFilters();

  console.log("Filters:", filters);

  return (
    <section className="space-y-4 flex items-center justify-center w-full gap-4">
      <DateRangePicker
        initialDateFrom={filters.initDate || undefined}
        initialDateTo={filters.endDate || undefined}
        showCompare={false}
        onUpdate={({ range }) => {
          setters.setInitDate(range.from);
          setters.setEndDate(range?.to ?? null);
        }}
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="apply-voucher"
          checked={filters.applyVoucher}
          onCheckedChange={(checked) =>
            setters.setApplyVoucher(checked as boolean)
          }
        />
        <Label htmlFor="apply-voucher">Voucher Aplicado?</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="order-desc"
          checked={filters.orderByDesc}
          onCheckedChange={(checked) =>
            setters.setOrderByDesc(checked as boolean)
          }
        />
        <Label htmlFor="order-desc">Ordenar descendente?</Label>
      </div>
    </section>
  );
}
