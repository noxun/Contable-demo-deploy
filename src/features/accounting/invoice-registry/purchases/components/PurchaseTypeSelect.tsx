import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type PurchaseTypeSelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
};

export const purchaseTypes = [
  {
    value: "1",
    label: "Compras para mercado interno con destino a actividades gravadas",
  },
  {
    value: "2",
    label: "Compras para mercado interno con destino a actividades no gravadas",
  },
  {
    value: "3",
    label: "Compras sujetas a proporcionalidad",
  },
  {
    value: "4",
    label: "Compras para exportaciones",
  },
  {
    value: "5",
    label: "Compras tanto para el mercado interno como para exportaciones",
  },
];

export function PurchaseTypeSelect({
  value,
  onValueChange,
  placeholder = "Selecciona un tipo de compra",
  triggerClassName = "",
}: PurchaseTypeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {purchaseTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
