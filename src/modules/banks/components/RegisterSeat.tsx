"use client";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { registerExtractToSeat } from "@/lib/data";
import { Account } from "@/modules/account/types/account";
import useAccounts from "@/modules/shared/hooks/useAccounts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { SingleValue } from "react-select";
import CustomSelect from "@/components/custom/select";
import { toast } from "sonner";

type RegisterSeatProps = {
  bankExtractId: number;
  bankId: string | number;
  hasBeenRegisteredToAccount: boolean;
  extractAccountId: number;
  selectedAccount: number | null;
  onSelectChange: (bankExtractId: number, accountId: number | null) => void;
};

export default function RegisterSeat({
  bankExtractId,
  bankId,
  hasBeenRegisteredToAccount,
  extractAccountId,
  selectedAccount: selectedAccountId,
  onSelectChange,
}: RegisterSeatProps) {
  const queryClient = useQueryClient();
  const { data: accounts, isPending } = useAccounts();

  console.log(accounts);

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
    if (selectedAccountId) {
      const values = {
        bankExtractId,
        accountId: selectedAccountId,
      };
      registerSeatMutation.mutate(values);
    }
  }

  const selectedAccountOption =
    accounts?.find((account) => account.id === selectedAccountId) ??
    (extractAccountId !== 0
      ? accounts?.find((account) => account.id === extractAccountId)
      : null) ;

  if (isPending || accounts === undefined) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-between gap-2">
      {accounts !== undefined ? (
        <CustomSelect
          isDisabled={hasBeenRegisteredToAccount}
          onChange={(option) => {
            onSelectChange(bankExtractId, option ? option.id : null);
          }}
          value={selectedAccountOption}
          options={accounts}
          getOptionValue={(account) => account.id.toString()}
          getOptionLabel={(account) => `${account.code}-${account.description}`}
        />
      ) : (
        <Spinner />
      )}
      <Button
        disabled={hasBeenRegisteredToAccount}
        title="Registrar Asiento Contable"
        onClick={handleRegister}
      >
        Registrar
      </Button>
    </div>
  );
}
