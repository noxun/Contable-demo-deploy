"use client";

import useMotionAccounts from "@/features/accounting/shared/hooks/useMotionAccounts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { ModelSeatForm } from "../types/modelSeat";
import { modelSeatFormSchema } from "../schemas/modelSeat";
import { useCallback, useMemo } from "react";
import useCreateModelSeatMutation from "./useCreateModelSeatMutation";

export default function useFormNewModelSeat() {

  //Obtener cuentas de la API
  const {
    data: motionAccounts,
    isLoading: isLoadingAccounts,
    isPending: isPendingAccounts,
  } = useMotionAccounts();

  //Inicializar el formulario con validaciones de Zod
  const modelSeatForm = useForm<ModelSeatForm>({
    resolver: zodResolver(modelSeatFormSchema),
    defaultValues: {
      description: "",
      type: 0,
    },
  });

  //Inicializar el campo de cuentas con el hook useFieldArray de react-hook-form
  const { fields, append, remove } = useFieldArray({
    control: modelSeatForm.control,
    name: "accounts",
  });

  // Observar valores para validaciones y cambios en la UI
  // const accounts = modelSeatForm.watch("accounts");
  const formType = modelSeatForm.watch("type");
  const formValues = modelSeatForm.watch();

  // Calcular el porcentaje total (solo para el tipo 3)
  const totalPercentage = useMemo(() => {
    if (formValues.type !== 3) return 0;
    
    return (formValues.accounts || []).reduce((sum, account) => {
      return sum + (Number(account.percentage) || 0);
    }, 0);
  }, [formValues]);

  // Chequear si el porcentaje total es válido
  const isPercentageValid = useMemo(() => {
    if (formType !== 3) return true;
    return totalPercentage >= 0 && totalPercentage <= 100;
  }, [totalPercentage, formType]);

  const mutation = useCreateModelSeatMutation();

  const handleAddAccount = useCallback(() => {
    append({
      accountId: 0,
      debit: false,
      asset: false,
      percentage: 0,
    });
  }, [append]);

  // Toggle debit/asset checkboxes
  const handleToggleDebitAsset = useCallback(
    (index: number, field: "debit" | "asset", value: boolean) => {
      modelSeatForm.setValue(`accounts.${index}.${field}`, value);
      modelSeatForm.setValue(
        `accounts.${index}.${field === "debit" ? "asset" : "debit"}`,
        !value
      );
    },
    [modelSeatForm]
  );

  // Submit handler
  const onSubmit = useCallback(
    (values: ModelSeatForm) => {
      mutation.mutate(values);
    },
    [mutation]
  );

  return {
    modelSeatForm,
    fields,
    isLoading: isLoadingAccounts || isPendingAccounts,
    isPending: mutation.isPending,
    motionAccounts,
    totalPercentage,
    isPercentageValid,
    handleAddAccount,
    handleToggleDebitAsset,
    removeAccount: remove,
    onSubmit,
  };
}
