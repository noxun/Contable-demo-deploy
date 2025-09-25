"use client";

import CustomSelect from "@/components/custom/select";
import { useMemo } from "react";
import useAccounts from "../hooks/useAccounts";
import { Account } from "../types/account";
import { SingleValue } from "react-select";

type AccountSelectProps = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  name?: string;
  usePortal: boolean;
};

export function AccountSelect({
  value,
  onChange,
  placeholder = "Selecciona una cuenta",
  isDisabled = false,
  name,
  usePortal = false,
}: AccountSelectProps) {
  const { data: accounts = [], isError, isLoading } = useAccounts();

  const resolvedValue = useMemo(() => {
    if (!value) return null;

    return accounts.find((account) => account.id.toString() === value) || null;
  }, [value, accounts]);

  const handleChange = (selectedValue: SingleValue<Account>) => {
    const selectedId = selectedValue?.id?.toString() || null;
    onChange?.(selectedId);
  };

  if (isError) {
    return <div>Error al cargar las cuentas.</div>;
  }

  return (
    <CustomSelect
      name={name}
      options={accounts}
      getOptionLabel={(option) => `${option.code} - ${option.description}`}
      getOptionValue={(option) => option.id.toString()}
      isClearable
      isDisabled={isDisabled || isLoading}
      isLoading={isLoading}
      value={resolvedValue}
      onChange={handleChange}
      placeholder={placeholder}
      noOptionsMessage={() => "No hay cuentas disponibles"}
      loadingMessage={() => "Cargando cuentas..."}
      menuPlacement="top"
      menuPortalTarget={typeof window !== "undefined" && usePortal ? document.body : null}
    />
  );
}
