"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Creatable from "react-select/creatable";
import { fixedAssetsQueryOptions } from "../hooks/useFixedAssets";
import { useState } from "react";
import { Assets } from "@/lib/data";
import { fixedAssetsService } from "../services/fixedAssetsService";
import { toast } from "sonner";

type Props = {
  value?: Assets | null;
  onChange: (value: Assets | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  name?: string;
};

export function CreatableSelectFixedAssets({
  value: controlledValue,
  onChange,
  placeholder = "Seleccionar o crear activo fijo...",
  isDisabled = false,
  name,
}: Props) {
  const [isCreating, setIsCreating] = useState(false);
  // Use controlled value if provided, otherwise fall back to internal state
  const [internalValue, setInternalValue] = useState<Assets | null>(null);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const queryClient = useQueryClient();

  const {
    data: listAssets = [],
    isLoading,
    isError,
  } = useQuery(fixedAssetsQueryOptions());

  async function handleCreate(newValue: string) {
    if (!newValue.trim()) return;

    setIsCreating(true);
    try {
      const response = await fixedAssetsService.postFixedAssetAccount(
        newValue.trim()
      );

      // Optimistically update the cache
      queryClient.setQueryData(
        fixedAssetsQueryOptions().queryKey,
        (oldData: Assets[] | undefined) => [...(oldData || []), response]
      );

      // Update value and call onChange
      if (!isControlled) {
        setInternalValue(response);
      }
      onChange(response);

      toast.success("Activo fijo creado correctamente");
    } catch (error) {
      console.error("Error al crear el activo fijo:", error);
      toast.error("Error al crear el activo fijo");
    } finally {
      setIsCreating(false);
    }
  }

  function handleChange(selectedOption: Assets | null) {
    if (!isControlled) {
      setInternalValue(selectedOption);
    }
    onChange(selectedOption);
  }

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        Error al cargar los activos fijos
      </div>
    );
  }

  return (
    <Creatable
      name={name}
      options={listAssets}
      getOptionLabel={(option) => option.typeActive}
      getOptionValue={(option) => option.id.toString()}
      isClearable
      isDisabled={isDisabled || isLoading || isCreating}
      isLoading={isLoading || isCreating}
      onCreateOption={handleCreate}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      noOptionsMessage={() => "No se encontraron activos fijos"}
      formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
      loadingMessage={() => "Cargando..."}
    />
  );
}
