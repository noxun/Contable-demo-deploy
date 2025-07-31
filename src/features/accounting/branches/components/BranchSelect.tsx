import CustomSelect from "@/components/custom/select";
import { useBranches } from "../hooks/useBranches";
import { useMemo } from "react";
import { BranchToList } from "@/lib/types";
import { SingleValue } from "react-select";

type Props = {
  value?: string;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  name?: string;
};

export function BranchSelect({
  value,
  onChange,
  placeholder = "Selecciona una rama",
  name,
  isDisabled = false,
}: Props) {
  const { data: branches = [], isLoading, isError } = useBranches();

  const resolvedValue = useMemo(() => {
    if (!value) return null;
    return branches.find((branch) => branch.id.toString() === value) ?? null;
  }, [branches, value]);

  const handleChange = (selectedValue: SingleValue<BranchToList>) => {
    const selectedId = selectedValue?.id?.toString() || null;
    onChange?.(selectedId);
  };

  if (isError) {
    return <div>Error al cargar las sucursales</div>;
  }

  return (
    <CustomSelect
      name={name}
      options={branches}
      getOptionLabel={(option) => option.nameSucutsal}
      getOptionValue={(option) => option.id.toString()}
      isClearable
      isDisabled={isDisabled || isLoading}
      isLoading={isLoading}
      value={resolvedValue}
      onChange={handleChange}
      placeholder={placeholder}
      noOptionsMessage={() => "No hay sucursales disponibles"}
      loadingMessage={() => "Cargando sucursales..."}
    />
  );
}
