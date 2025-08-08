"use client";

import {
  BankExcerpt,
  BankSelectionState,
  TypeSelectionState,
} from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import RegisterSeat from "./RegisterSeat";
import RegisterTrazoButton from "./RegisterTrazoButton";
import DialogAccountDetails from "./DialogAccountDetails";
import DeleteBankExcerptButton from "./DeleteBankExcerptButton";
import DialogNewExcerptRegisterPayment from "./DialogNewExcerptRegisterPayment";
import DialogAccountDetailsDollar from "./DialogAccountDetailsDollar";
import DialogFormNewVoucher from "./DialogFormNewVoucher";
import { memo } from "react";
import DialogAdvancedExtractRegistry from "./DialogAdvancedExtractRegistry";

interface MemoizedBankRowProps {
  bankExtract: BankExcerpt;
  bankId: string | number;
  selectedAccounts: {
    [key: number]: number | null;
  };
  selectedTypes: {
    [key: number]: number | null;
  };
  onSelectChange: (bankExtractId: number, accountId: number | null) => void;
  onTypeSelectChange: (bankExtractId: number, type: number) => void;
}

const MemoizedBankRow = memo(function MemoizedBankRow({
  bankExtract,
  bankId,
  selectedAccounts,
  selectedTypes,
  onSelectChange,
  onTypeSelectChange,
}: MemoizedBankRowProps) {
  return (
    <RegisterSeat
      bankExtract={bankExtract}
      registeredType={bankExtract.type}
      bankExtractId={bankExtract.id}
      accountDetail={bankExtract.accountDetail}
      bankId={bankId}
      hasBeenRegisteredToAccount={
        bankExtract.accountId !== 0 || bankExtract.accountingEntry
      }
      extractAccountId={bankExtract.accountId}
      selectedAccount={selectedAccounts[bankExtract.id]}
      onSelectChange={onSelectChange}
      selectedType={selectedTypes[bankExtract.id]}
      onTypeSelectChange={onTypeSelectChange}
    />
  );
});

export function columns(
  bankAccountId: string | null,
  bankId: string | number,
  selectedAccounts: BankSelectionState,
  selectedTypes: TypeSelectionState,
  onSelectChange: (bankExtractId: number, accountId: number | null) => void,
  onTypeSelectChange: (bankExtractId: number, type: number) => void
): ColumnDef<BankExcerpt>[] {
  //bankId para invalidar las queries

  return [
    {
      accessorKey: "date",
      header: "Fecha",
    },
    {
      accessorKey: "nroDocument",
      header: "Numero de Doc.",
    },
    {
      accessorKey: "amount",
      header: "Monto",
    },
    {
      accessorKey: "internCode",
      header: "Cod. Interno",
    },
    {
      accessorKey: "glossInExtract",
      header: "Glosa",
    },
    {
      header: "Cuenta de banco",
      cell: ({ row }) => {
        const bankExtract = row.original;
        return (
          <MemoizedBankRow
            bankExtract={bankExtract}
            bankId={bankId}
            selectedAccounts={selectedAccounts}
            selectedTypes={selectedTypes}
            onSelectChange={onSelectChange}
            onTypeSelectChange={onTypeSelectChange}
          />
        );
      },
    },
    {
      header: "Acciones",
      cell: ({ row }) => {
        const bankExtract = row.original;
        return (
          <div className="flex items-center gap-2">
            <DialogAdvancedExtractRegistry
              bankExtract={bankExtract}
              bankId={parseInt(bankId as string)}
              bankAccountId={bankAccountId ? parseInt(bankAccountId) : 0}
              disabled={bankExtract.accountingEntry}
            />
            <RegisterTrazoButton
              bankId={bankId}
              bankExtractId={bankExtract.id}
              disabled={
                bankExtract.trazoRegister
                  ? bankExtract.trazoRegister
                  : !bankExtract.accountingEntry && !bankExtract.trazoRegister
              }
              hasBeenRegisteredToTrazo={bankExtract.trazoRegister}
            />
            <DialogAccountDetails
              bankExtractId={bankExtract.id}
              accountId={bankExtract.accountId}
            />
            <DialogAccountDetailsDollar
              bankExtractId={bankExtract.id}
              accountId={bankExtract.accountId}
            />
            <DialogNewExcerptRegisterPayment bankExtractId={bankExtract.id} />
            <DeleteBankExcerptButton
              bankExtractId={bankExtract.id}
              bankId={bankId}
            />
          </div>
        );
      },
    },
  ];
}
