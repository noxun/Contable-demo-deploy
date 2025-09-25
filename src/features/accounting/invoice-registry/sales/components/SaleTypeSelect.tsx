import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SaleTypeSelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
};

export const saleTypes = [
  {
    value: "0",
    label: "Otros",
  },
  {
    value: "1",
    label: "Gift Card (Venta de Tarjeta de Regalo)",
  },
];

export function SaleTypeSelect({
  value,
  onValueChange,
  placeholder = "Selecciona un tipo de venta",
  triggerClassName = "",
}: SaleTypeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {saleTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
