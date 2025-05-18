"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getVoucherType, getVoucherTypeRoute } from "@/lib/utils";
import ListVouchers from "@/features/accounting/shared/components/ListVouchers";
import {
  VoucherType,
  VoucherTypeRoute,
} from "@/features/accounting/shared/types/sharedTypes";
import { useState } from "react";

const voucherOptions = ["0", "1", "2"];

export default function TransactionsPage() {
  const [selectedOption, setSelectedOption] = useState(
    voucherOptions[0]
  );

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Transacciones</h2>
        <div>
          <Select
            value={selectedOption}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Seleccione el tipo de transacción" />
            </SelectTrigger>
            <SelectContent>
              <SelectContent>
                {voucherOptions.map((option, index) => (
                  <SelectItem
                    key={index}
                    value={option}
                  >
                    {getVoucherType(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ListVouchers
        voucherType={selectedOption as VoucherType}
        voucherTypeRoute={getVoucherTypeRoute(selectedOption) as VoucherTypeRoute}
      />
    </section>
  );
}
