import CustomSelect from "@/components/custom/select";
import { useMemo, useState } from "react";
import { useRegisteredNitData } from "../hooks/useRegisteredNitData";
import { SingleValue } from "react-select";
import { CompanyNitData } from "../schemas/companyNitDataSchema";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Props = {
  value?: string;
  onChange?: (value: string, companyName?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  filter: "byBuy" | "bySale";
  name?: string;
};

export function NitSelect({
  value,
  onChange,
  placeholder = "Seleccione un NIT",
  disabled = false,
  filter,
  name,
}: Props) {
  const [useSelect, setUseSelect] = useState(true);
  const {
    data: nitData = [],
    isError,
    isLoading,
  } = useRegisteredNitData(filter);

  const calculatedValue = useMemo(() => {
    if (!value) return null;
    return nitData.find((item) => item.nit === value) || null;
  }, [value, nitData]);

  const handleInternalChange = (selectedValue: SingleValue<CompanyNitData>) => {
    const selectedNit = selectedValue?.nit || null;
    const selectedName = selectedValue?.name || null;
    onChange?.(selectedNit ?? "", selectedName ?? "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value, "");
  };

  if (isError) {
    return <div>Error al cargar los NITs.</div>;
  }

  return (
    <div className="flex gap-2 items-center">
      {/* Conditional Rendering */}
      {useSelect ? (
        <CustomSelect
          className="flex-1"
          name={name}
          options={nitData}
          getOptionLabel={(item) => item.name ?? "Sin nombre"}
          getOptionValue={(item) => item.nit ?? "Sin NIT"}
          isClearable
          isDisabled={disabled || isLoading}
          isLoading={isLoading}
          value={calculatedValue}
          onChange={handleInternalChange}
          placeholder={placeholder}
          noOptionsMessage={() => "No hay NITs disponibles"}
          loadingMessage={() => "Cargando NITs..."}
        />
      ) : (
        <Input
          className="flex-1"
          name={name}
          value={value ?? ""}
          onChange={handleInputChange}
          placeholder={placeholder || "Ingrese el NIT manualmente"}
          disabled={disabled}
        />
      )}
      {/* Toggle Switch */}
      <div className="flex items-center space-x-2">
        <Switch
          id="input-mode"
          checked={useSelect}
          onCheckedChange={setUseSelect}
        />
        <Label htmlFor="input-mode" className="text-sm">
          {useSelect ? "Modo selección" : "Modo manual"}
        </Label>
      </div>
    </div>
  );
}
