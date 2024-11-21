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
};

export default function RegisterSeat({
  bankExtractId,
  bankId,
  hasBeenRegisteredToAccount,
  extractAccountId,
}: RegisterSeatProps) {
  const [selectedAccount, setSelectedAccount] =
    useState<null | SingleValue<Account>>(null);
  const queryClient = useQueryClient();
  const { data: accounts, isPending } = useAccounts();

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
    if (selectedAccount) {
      const values = {
        bankExtractId,
        accountId: selectedAccount.id,
      };
      registerSeatMutation.mutate(values);
    }
  }

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <CustomSelect
        isDisabled={hasBeenRegisteredToAccount}
        onChange={(option) => {
          setSelectedAccount(option);
        }}
        value={
          selectedAccount ?? extractAccountId !== 0
            ? accounts?.find((item) => item.id === extractAccountId)
            : null
        }
        options={accounts}
        getOptionValue={(account) => account.id.toString()}
        getOptionLabel={(account) => `${account.code}-${account.description}`}
      />
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
