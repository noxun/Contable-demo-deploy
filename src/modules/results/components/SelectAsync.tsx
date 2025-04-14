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
