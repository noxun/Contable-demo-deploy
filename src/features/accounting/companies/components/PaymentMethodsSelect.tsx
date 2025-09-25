"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PaymentMethodsSelectProps {
  value?: string
  onChange?: (value: string) => void
}

export function PaymentMethodsSelect({
  value,
  onChange,
}: PaymentMethodsSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-fit">
        <SelectValue placeholder="Seleccionar método de pago" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Métodos de Pago</SelectLabel>
          <SelectItem value="cheque">Cheque</SelectItem>
          <SelectItem value="transferencia">Transferencia</SelectItem>
          <SelectItem value="efectivo">Efectivo</SelectItem>
          <SelectItem value="otros">Otros</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
// TAL VEZ AGREGAR OTRO CAMPO DE COLUMNA O CONCEPTO Y UN LINK QUE LLEVA A LA EDICION DEL VOUCHER?