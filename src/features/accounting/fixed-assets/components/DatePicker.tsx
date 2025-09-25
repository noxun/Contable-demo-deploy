import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface DatePickerFieldProps {
  value: Date | undefined; // Cambio de null a undefined
  onChange: (date: Date | undefined) => void; // Cambio de null a undefined
}

export function DatePicker({ value, onChange }: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[240px] pl-3 text-left font-normal"
        >
          {value ? format(value, "dd/MM/yyyy") : <span>Seleccione una fecha</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date || undefined);
            setIsOpen(false);
          }}
          initialFocus
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}
