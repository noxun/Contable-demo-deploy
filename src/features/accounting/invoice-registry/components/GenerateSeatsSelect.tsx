import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type GenerateSeatSelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
};

export const generateSeatTypes = [
  {
    value: "0",
    label: "Generar un asiento por cada item",
  },
  {
    value: "1",
    label: "Generar un asiento agrupado por dia",
  },
  {
    value: "2",
    label: "Generar un asiento agrupado por mes",
  },
];

export function GenerateSeatSelect({
  value,
  onValueChange,
  placeholder = "Selecciona una modalidad para generar asientos automáticos",
  triggerClassName = "",
}: GenerateSeatSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {generateSeatTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
