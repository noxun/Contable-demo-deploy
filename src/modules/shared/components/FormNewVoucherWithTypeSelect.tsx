"use client";
import FormNewVoucher, { ModelBloque } from "@/modules/shared/components/FormNewVoucher";
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
import { RegisterVoucherByDocumentResponse, VoucherItemFromExtractedPDF } from "@/lib/types";

type FormNewVoucherWithTypeSelectProps = {
  bankAccountId?: string;
  amountFromExtract?: number;
  dateFromExtract?: string;
  bankId?: string;
  bankExtractId?: number;
  gloss?: string;
  voucherItemsFromExtractedPDF?: VoucherItemFromExtractedPDF[];
  voucher?: RegisterVoucherByDocumentResponse;
  seatBlockType?: ModelBloque;
};

export default function FormNewVoucherWithTypeSelect({
  bankAccountId,
  amountFromExtract,
  dateFromExtract,
  bankId,
  bankExtractId,
  gloss,
  voucherItemsFromExtractedPDF,
  voucher,
  seatBlockType,
}: FormNewVoucherWithTypeSelectProps) {
  const [selectedType, setSelectedType] = useState("0");

  let validVoucherItemsPDF = null;

  if(!voucherItemsFromExtractedPDF || voucherItemsFromExtractedPDF.length <=0){
    validVoucherItemsPDF = undefined;
  }else{
    validVoucherItemsPDF = voucherItemsFromExtractedPDF;
  }

  return (
    <>
      <div className="space-y-4">
        <Label>Selecciona el tipo de transacción que quieres realizar</Label>
        <Select
          value={voucher?.type.toString() ?? selectedType}
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
      <FormNewVoucher
        type={selectedType as VoucherType}
        bankId={bankId}
        bankExtractId={bankExtractId}
        gloss={gloss}
        voucherItemsFromExtractedPDF={validVoucherItemsPDF}
        voucherFromRegisterByDocResponse={voucher}
        bankAccountId={bankAccountId}
        amountFromExtract={amountFromExtract}
        dateFromExtract={dateFromExtract}
        seatBlockType={seatBlockType}
      />
    </>
  );
}
