"use client"
import FormNewVoucher from "@/modules/shared/components/FormNewVoucher";
import {
  VoucherType,
  VoucherTypeRoute,
} from "@/modules/shared/types/sharedTypes";

import dynamic from "next/dynamic";

const DynamicFormNewVoucher = dynamic(()=> import('@/modules/shared/components/FormNewVoucher'), {
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
