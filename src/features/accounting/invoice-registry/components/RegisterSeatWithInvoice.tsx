"use client";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { registerExtractToSeat } from "@/lib/data";
import useAccounts from "@/features/accounting/shared/hooks/useAccounts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import CustomSelect from "@/components/custom/select";
import { toast } from "sonner";

type RegisterSeatWithInvoiceProps = {
  invoiceRegistryId: number;
  // bankId: string | number;
  // hasBeenRegisteredToAccount: boolean;
  extractAccountId: number;
  selectedAccount: number | null;
  onSelectChange: (bankExtractId: number, accountId: number | null) => void;
};

export default function RegisterSeatWithInvoice({
  invoiceRegistryId,
  extractAccountId,
  selectedAccount: selectedAccountId,
  onSelectChange,
}: RegisterSeatWithInvoiceProps) {
  const queryClient = useQueryClient();
  const { data: accounts, isPending } = useAccounts();

  console.log(accounts);

  const registerSeatWithInvoiceMutation = useMutation({
    mutationFn: async ()=>{},
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Hubo un error al registrar la cuenta con la factura");
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["bankExcerpt", bankId] });
      toast.success("Datos registrados correctamente");
    },
  });

  function handleRegister() {
    if (selectedAccountId) {
      const values = {
        invoiceRegistryId,
        accountId: selectedAccountId,
      };
      // registerSeatMutation.mutate(values);
    }
  }

  const selectedAccountOption =
    (accounts ?? []).find((account) => account.id === selectedAccountId) ??
    (extractAccountId !== 0
      ? accounts?.find((account) => account.id === extractAccountId)
      : null);

  if (isPending || accounts === undefined) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-between gap-2">
      {true ? (
        <CustomSelect
          // isDisabled={hasBeenRegisteredToAccount}
          onChange={(option) => {
            onSelectChange(invoiceRegistryId, option ? option.id : null);
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
        // disabled={hasBeenRegisteredToAccount}
        title="Registrar Asiento Contable"
        onClick={handleRegister}
      >
        Registrar
      </Button>
    </div>
  );
}
