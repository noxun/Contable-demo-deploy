import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SaleStatusSelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
};

export const saleStatuses = [
  {
    value: "A",
    label: "ANULADA",
  },
  {
    value: "V",
    label: "VALIDA",
  },
  {
    value: "C",
    label: "EMITIDA EN CONTINGENCIA",
  },
  {
    value: "L",
    label: "LIBRE CONSIGNACIÓN",
  },
];

export function SaleStatusSelect({
  value,
  onValueChange,
  placeholder = "Selecciona el estado de la venta(factura)",
  triggerClassName = "",
}: SaleStatusSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {saleStatuses.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
