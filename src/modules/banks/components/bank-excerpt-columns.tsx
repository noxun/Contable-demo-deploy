"use client";

import { BankExcerpt, BankSelectionState } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import RegisterSeat from "./RegisterSeat";
import RegisterTrazoButton from "./RegisterTrazoButton";
import DialogAccountDetails from "./DialogAccountDetails";
import DeleteBankExcerptButton from "./DeleteBankExcerptButton";
import DialogNewExcerptRegisterPayment from "./DialogNewExcerptRegisterPayment";
import DialogAccountDetailsDollar from "./DialogAccountDetailsDollar";
import DialogFormNewVoucher from "./DialogFormNewVoucher";

export function columns(
  bankId: string | number,
  selectedAccounts: BankSelectionState,
  onSelectChange: (bankExtractId: number, accountId: number | null) => void
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
          <RegisterSeat
            registeredType={bankExtract.type}
            bankExtractId={bankExtract.id}
            bankId={bankId}
            hasBeenRegisteredToAccount={bankExtract.accountId !== 0}
            extractAccountId={bankExtract.accountId}
            selectedAccount={selectedAccounts[bankExtract.id]}
            onSelectChange={onSelectChange}
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
            <DialogFormNewVoucher/>
            <RegisterTrazoButton
              bankId={bankId}
              bankExtractId={bankExtract.id}
              disabled={
                bankExtract.trazoRegister
                  ? bankExtract.trazoRegister
                  : !bankExtract.accountingEntry && !bankExtract.trazoRegister
              }
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
