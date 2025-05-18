"use client";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { registerExtractToSeat } from "@/lib/data";
import useAccounts from "@/features/accounting/shared/hooks/useAccounts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import CustomSelect from "@/components/custom/select";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { BankExcerpt } from "@/lib/types";

export type RegisterSeatProps = {
  bankExtract: BankExcerpt;
  bankExtractId: number;
  bankId: string | number;
  registeredType: number | undefined; //egreso, traspaso, ingreso
  hasBeenRegisteredToAccount: boolean;
  extractAccountId: number;
  accountDetail?: string;
  selectedAccount: number | null;
  onSelectChange: (bankExtractId: number, accountId: number | null) => void;
  selectedType: number | null;
  onTypeSelectChange: (bankExtractId: number, type: number) => void;
};

const getTypeLabel = (type: number) => {
  switch (type) {
    case 0:
      return "Traspaso";
    case 1:
      return "Egreso";
    case 2:
      return "Ingreso";
    default:
      return "";
  }
};

export default function RegisterSeat({
  bankExtract,
  registeredType,
  bankExtractId,
  bankId,
  hasBeenRegisteredToAccount,
  extractAccountId,
  accountDetail,
  selectedAccount: selectedAccountId,
  onSelectChange,
  selectedType,
  onTypeSelectChange,
}: RegisterSeatProps) {
  const queryClient = useQueryClient();
  const { data: accounts, isPending } = useAccounts();
  // console.log(accounts);

  const registerSeatMutation = useMutation({
    mutationFn: registerExtractToSeat,
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Hubo un error al registrar el extracto con el asiento");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankExcerpt", bankId] });
      toast.success("Datos registrados correctamente");
    },
  });

  function handleRegister() {
    const accountToRegister = selectedAccountId ?? 
      (accounts?.find(account => account.code === bankExtract.accountCode)?.id ?? null);
    
    const typeToRegister = selectedType ?? bankExtract.type;
  
    if (accountToRegister && (typeToRegister || typeToRegister === 0)) {
      const values = {
        bankExtractId,
        accountId: accountToRegister,
        type: typeToRegister.toString(),
      };
      console.log("registering", bankExtractId, accountToRegister, typeToRegister);
      registerSeatMutation.mutate(values);
    } else {
      toast.error("Por favor seleccione una cuenta y un tipo de registro");
    }
  }


  if (isPending || accounts === undefined) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-between gap-2">
      {accountDetail && bankExtract.accountingEntry ? (
        <div className="min-w-[300px]">{accountDetail}</div>
      ) : (
        <CustomSelect
          className="w-[280px]"
          isDisabled={bankExtract.accountingEntry}
          onChange={(option) => {
            onSelectChange(bankExtractId, option ? option.id : null);
          }}
          value={
            accounts?.find(
              (account) => account.code === bankExtract.accountCode
            ) ?? accounts?.find((account) => account.id === selectedAccountId)
          }
          options={accounts}
          getOptionValue={(account) => account.id.toString()}
          getOptionLabel={(account) => `${account.code}-${account.description}`}
        />
      )}
      {registeredType !== undefined && bankExtract.accountingEntry ? (
        <div className="min-w-[180px]">{bankExtract.typeTransacction}</div>
      ) : (
        <Select
          value={
            selectedType?.toString() ?? bankExtract?.type?.toString() ?? ""
          }
          onValueChange={(value) => {
            onTypeSelectChange(bankExtractId, parseInt(value));
          }}
          disabled={bankExtract.accountingEntry}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de registro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Traspaso</SelectItem>
            <SelectItem value="1">Egreso</SelectItem>
            <SelectItem value="2">Ingreso</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Button
        disabled={bankExtract.accountingEntry}
        title="Registrar Asiento Contable"
        onClick={handleRegister}
      >
        Registrar
      </Button>
    </div>
  );
}
