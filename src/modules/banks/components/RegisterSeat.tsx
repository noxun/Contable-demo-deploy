"use client";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { registerExtractToSeat } from "@/lib/data";
import useAccounts from "@/modules/shared/hooks/useAccounts";
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
import { useState } from "react";

type RegisterSeatProps = {
  bankExtractId: number;
  bankId: string | number;
  registeredType: number | undefined; //egreso, traspaso, ingreso
  hasBeenRegisteredToAccount: boolean;
  extractAccountId: number;
  selectedAccount: number | null;
  onSelectChange: (bankExtractId: number, accountId: number | null) => void;
  selectedType: number | null;
  onTypeSelectChange: (bankExtractId: number, type: number) => void;
};

export default function RegisterSeat({
  registeredType,
  bankExtractId,
  bankId,
  hasBeenRegisteredToAccount,
  extractAccountId,
  selectedAccount: selectedAccountId,
  onSelectChange,
  selectedType,
  onTypeSelectChange,
}: RegisterSeatProps) {
  const queryClient = useQueryClient();
  const { data: accounts, isPending } = useAccounts();
  // const [type, setType] = useState<string>("0");

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
    console.log(selectedAccountId, selectedType);
    if (selectedAccountId && (selectedType || selectedType === 0)) {
      const values = {
        bankExtractId,
        accountId: selectedAccountId,
        type: selectedType.toString(),
      };
      registerSeatMutation.mutate(values);
    }
  }

  const selectedAccountOption =
    (Array.isArray(accounts) ? accounts : []).find(
      (account) => account.id === selectedAccountId
    ) ??
    (extractAccountId !== 0
      ? accounts?.find((account) => account.id === extractAccountId)
      : null);

  if (isPending || accounts === undefined) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-between gap-2">
      {
        <>
          <CustomSelect
            isDisabled={hasBeenRegisteredToAccount}
            onChange={(option) => {
              onSelectChange(bankExtractId, option ? option.id : null);
            }}
            value={selectedAccountOption}
            options={accounts}
            getOptionValue={(account) => account.id.toString()}
            getOptionLabel={(account) =>
              `${account.code}-${account.description}`
            }
          />
          <Select
            value={selectedType?.toString() ?? ""}
            defaultValue={registeredType?.toString() ?? ""}
            onValueChange={(value) => {
              // setType(value)
              onTypeSelectChange(bankExtractId, parseInt(value));
            }}
            disabled={hasBeenRegisteredToAccount}
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
        </>
      }
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
