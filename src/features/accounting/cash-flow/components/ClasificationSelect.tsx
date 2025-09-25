import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const operationTypes = [
  { value: "FINANCIACION", label: "Financiación" },
  { value: "INVERSION", label: "Inversión" },
  { value: "OPERACION", label: "Operativa" },
];

export function ClasificationSelect(
  {value, onValueChange}: Props
) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Clasificación" />
      </SelectTrigger>
      <SelectContent>
        {operationTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
