"use client"
import FormNewVoucher from "@/features/accounting/shared/components/FormNewVoucher";
import {
  VoucherType,
  VoucherTypeRoute,
} from "@/features/accounting/shared/types/sharedTypes";

import dynamic from "next/dynamic";

const DynamicFormNewVoucher = dynamic(()=> import('@/features/accounting/shared/components/FormNewVoucher'), {
  loading: ()=> <div>Cargando...</div>,
  ssr: false,
})

export default function NewDiaryPage() {
  return (
    <div className="px-6">
      <h2 className="text-lg font-bold">Formulario para crear un diario</h2>
      <DynamicFormNewVoucher
        type={VoucherType.DIARY}
        routeType={VoucherTypeRoute.DIARY}
      />
    </div>
  );
}
