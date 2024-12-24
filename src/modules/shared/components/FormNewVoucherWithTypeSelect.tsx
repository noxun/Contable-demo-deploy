"use client";
import FormNewVoucher from "@/modules/shared/components/FormNewVoucher";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { VoucherType } from "@/modules/shared/types/sharedTypes";
import { Label } from "@/components/ui/label";

type FormNewVoucherWithTypeSelectProps = {
  bankId?: string;
  bankExtractId?: number ;
};


export default function FormNewVoucherWithTypeSelect({bankId,bankExtractId}: FormNewVoucherWithTypeSelectProps) {
  const [selectedType, setSelectedType] = useState("0");
  return (
    <>
      <div className="space-y-4">
        <Label>Selecciona el tipo de transacción que quieres realizar</Label>
        <Select
          value={selectedType}
          onValueChange={(value) => {
            setSelectedType(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de transacción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Traspaso</SelectItem>
            <SelectItem value="1">Egreso</SelectItem>
            <SelectItem value="2">Ingreso</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <FormNewVoucher type={selectedType as VoucherType} bankId={bankId} bankExtractId={bankExtractId} />
    </>
  );
}
