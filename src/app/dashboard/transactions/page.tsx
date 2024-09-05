'use client'; // Esto convierte el componente en un Client Component

import { Button } from "@/components/ui/button";
import ListVouchers from "@/modules/shared/components/ListVouchers";
import {
  VoucherType,
  VoucherTypeRoute,
} from "@/modules/shared/types/sharedTypes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function IncomesPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);

    // Redirigir a la ruta correspondiente
    if (value) {
      router.push(value);
    }
  };

  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Transacciones</h2>
        <div className="">                         
            <select 
              value={selectedOption} 
              onChange={handleSelectChange} 
              className="bg-[#3A72EC] text-[#F8FAFC] border-none rounded-md font-semibold h-10 "
            >            
              <option value="" disabled>
                Seleccione el tipo de transacción
              </option>
              <option value="/dashboard/income/new">Ingresos</option>
              <option value="/dashboard/expenses/new">Egresos</option>
              <option value="/dashboard/diary/new">Traspaso</option>
            </select>          
        </div>
      </div>
      <ListVouchers
        voucherType={VoucherType.INCOME}
        voucherTypeRoute={VoucherTypeRoute.INCOME}
      />
    </section>
  );
}
