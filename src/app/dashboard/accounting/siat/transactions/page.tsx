"use client"; // Esto convierte el componente en un Client Component

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SyncAccountsButton from "@/modules/link/components/SyncAccountsButton";
import ListVouchers from "@/modules/shared/components/ListVouchers";
import {
  VoucherType,
  VoucherTypeRoute,
} from "@/modules/shared/types/sharedTypes";
import { useState } from "react";

type VoucherInfo = {
  label?: string;
  voucherType: string;
  voucherTypeRoute: string;
};

const voucherOptions: VoucherInfo[] = [
  { label: "Traspaso", voucherType: "0", voucherTypeRoute: "diary" },
  { label: "Egresos", voucherType: "1", voucherTypeRoute: "expenses" },
  { label: "Ingresos", voucherType: "2", voucherTypeRoute: "income" },
];

export default function SiatTransactionsPage() {
  const [selectedOption, setSelectedOption] = useState<null | VoucherInfo>(
    voucherOptions[0]
  );

  const handleSelectChange = (value: string) => {
    const newValue: VoucherInfo = JSON.parse(value);
    setSelectedOption(newValue);
  };

  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <SyncAccountsButton/>
        <h2 className="text-lg font-semibold">Transacciones Siat</h2>
        <div>
          <Select
            // value={selectedOption}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Seleccione el tipo de transaccion" />
            </SelectTrigger>
            <SelectContent>
              <SelectContent>
                {voucherOptions.map((option) => (
                  <SelectItem
                    key={option.voucherType}
                    value={JSON.stringify(option)}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ListVouchers
        voucherType={selectedOption?.voucherType as VoucherType}
        voucherTypeRoute={selectedOption?.voucherTypeRoute as VoucherTypeRoute}
        siat="siat"
      />
    </section>
  );
}
