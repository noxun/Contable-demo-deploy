"use client";

import CustomSelect from "@/components/custom/select";
import { useMemo } from "react";
import useBanks from "../hooks/useBanks";
import { IBank } from "../interface/banks";
import { SingleValue } from "react-select";

type BankSelectProps = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  name?: string;
  usePortal?: boolean;
};

export function BankSelect({
  value,
  onChange,
  placeholder = "Selecciona un banco",
  isDisabled = false,
  name,
  usePortal = false,
}: BankSelectProps) {
  const { data: banks = [], isError, isLoading } = useBanks();

  const resolvedValue = useMemo(() => {
    if (!value) return null;

    return banks.find((bank) => bank.accountId.toString() === value) || null;
  }, [value, banks]);

  const handleChange = (selectedValue: SingleValue<IBank>) => {
    const selectedId = selectedValue?.accountId?.toString() || null;
    onChange?.(selectedId);
  };

  if (isError) {
    return <div>Error al cargar los bancos.</div>;
  }

  return (
    <CustomSelect
      name={name}
      options={banks}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.accountId.toString()}
      isClearable
      isDisabled={isDisabled || isLoading}
      isLoading={isLoading}
      value={resolvedValue}
      onChange={handleChange}
      placeholder={placeholder}
      noOptionsMessage={() => "No hay bancos disponibles"}
      loadingMessage={() => "Cargando bancos..."}
      menuPlacement="top"
      menuPortalTarget={typeof window !== "undefined" && usePortal ? document.body : null}
    />
  );
}
