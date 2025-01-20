import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface DatePickerFieldProps {
  value: string | null;
  onChange: (date: string | null) => void;
  className?: string
}

export function DatePickerField({ value, onChange, className = "w-[240px]" }: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} >
      <PopoverTrigger asChild >
        <FormControl>
          <Button
            variant="outline"
            className={`pl-3 text-left font-normal ${className}`}
          >
            {value ? format(new Date(value), "dd/MM/yyyy") : <span>Seleccione una fecha</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            onChange(date ? date.toISOString() : null);
            setIsOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}