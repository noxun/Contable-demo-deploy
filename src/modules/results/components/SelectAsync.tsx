import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props<T> {
  options: T[];
  nameGroup: string;
  value?: string;
  label: string;
  onChange: (value: string | undefined) => void;
  valueKey?: keyof T;
  labelKey?: keyof T;
}

/**
 * Componente Select asíncrono genérico para seleccionar una opción de una lista.
 *
 * @props
 * - `options`: Lista de opciones a mostrar en el select.
 * - `value`: Valor seleccionado en el select.
 * - `label`: Texto que se muestra como marcador de posición o etiqueta del select.
 * - `nameGroup`: Nombre del grupo para la etiqueta del select.
 * - `onChange`: Función de callback que se ejecuta cuando cambia el valor seleccionado.
 * - `valueKey`: Clave del valor que se utiliza para cada opción. Por defecto es "id".
 * - `labelKey`: Clave que se utiliza para mostrar el texto de cada opción. Por defecto es "nombre".
 * 
 * @example
 * const options = [
 
 *   { id: "3", nombre: "Opción 3" },
 * ];
 * 
 * 
 * <SelectAsync
 *   options={[
 *     { id: "1", nombre: "Opción 1" },
 *     { id: "2", nombre: "Opción 2" },
 *   ]}
 *   value="1"
 *   label="Selecciona una opción"
 *   nameGroup="Grupo de opciones"
 *   onChange={(value) => console.log(value)}
 * />
 */

export function SelectAsync<T>({
  options = [],
  value,
  label,
  nameGroup,
  onChange,
  valueKey = "id" as keyof T,
  labelKey = "nombre" as keyof T,
}: Props<T>) {
  return (
    <Select value={value ?? ""} onValueChange={(val) => onChange(val === "all" ? undefined : val)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup >
          <SelectLabel>{nameGroup}</SelectLabel>
          {options.map((opt, index) => (
            <SelectItem
              key={`opt-${index}`}
              value={String(opt[valueKey])}
            >
              {String(opt[labelKey])}
            </SelectItem>
          ))}
          <SelectItem value="all">Todos</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
