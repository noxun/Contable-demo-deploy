import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRegisteredNitData } from "../hooks/useRegisteredNitData";
import Select, {
  InputActionMeta,
  SelectInstance,
  SingleValue,
  components,
  InputProps,
} from "react-select";
import { CompanyNitData } from "../schemas/companyNitDataSchema";

type Props = {
  value?: string;
  onChange?: (value: string, companyName?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  filter: "byBuy" | "bySale";
  name?: string;
};

const Input = (props: InputProps<CompanyNitData>) => (
  <components.Input {...props} isHidden={false} />
);

export function NitSelectInput({
  value,
  onChange,
  placeholder = "Seleccione un NIT",
  disabled = false,
  filter,
  name,
}: Props) {
  const [inputValue, setInputValue] = useState("");

  const {
    data: nitData = [],
    isError,
    isLoading,
  } = useRegisteredNitData(filter);

  const calculatedValue = useMemo(() => {
    if (!value) return null;
    return nitData.find((item) => item.nit === value) || null;
  }, [value, nitData]);

  useEffect(() => {
    if (value && calculatedValue) {
      setInputValue(value);
    } else if (!value) {
      setInputValue("");
    }
  }, [value, calculatedValue]);

  const handleInternalChange = useCallback(
    (selectedValue: SingleValue<CompanyNitData>) => {
      const selectedNit = selectedValue?.nit || null;
      const selectedName = selectedValue?.name || null;
      setInputValue(selectedNit || "");
      onChange?.(selectedNit ?? "", selectedName ?? "");
    },
    [onChange]
  );

  const selectRef = useRef<SelectInstance<CompanyNitData>>(null);

  const onFocus = () =>
    calculatedValue && selectRef.current?.selectOption(calculatedValue);

  const handleInputChange = useCallback(
    (newValue: string, actionMeta: InputActionMeta) => {
      if (actionMeta.action === "input-change") {
        setInputValue(newValue);
        onChange?.(newValue, "");
      }
    },
    [onChange]
  );

  if (isError) {
    return <div>Error al cargar los NITs.</div>;
  }

  return (
    <Select
      className="flex-1"
      classNamePrefix="my-react-select"
      name={name}
      options={nitData}
      getOptionLabel={(item) => item?.name ?? "Sin nombre"}
      getOptionValue={(item) => item?.nit ?? "Sin NIT"}
      isClearable
      isDisabled={disabled || isLoading}
      isLoading={isLoading}
      value={calculatedValue}
      onChange={handleInternalChange}
      onInputChange={handleInputChange}
      placeholder={placeholder}
      noOptionsMessage={() => "No hay NITs disponibles"}
      loadingMessage={() => "Cargando NITs..."}
      ref={selectRef}
      onFocus={onFocus}
      controlShouldRenderValue={false}
      inputValue={inputValue}
      components={{ Input }}
    />
  );
}
