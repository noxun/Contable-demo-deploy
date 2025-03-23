import { useCallback, useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { es } from "date-fns/locale";

type DateSelectorProps = {
  onDateChange: (initDate: Date | null, endDate: Date | null) => void;
};

export const DateSelector: React.FC<DateSelectorProps> = ({ onDateChange }) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  }) // DateRange en lugar de un objeto con from y to
  const [currentDay, setCurrentDay] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const handleDateChange = useCallback( () => {
    if (currentDay) {
      const today = new Date();
      onDateChange(today, today);
    } else if (selectedMonth) {
      const [year, month] = selectedMonth.split("-").map(Number);
      const initDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      onDateChange(initDate, endDate);
    } else if (date?.from && date?.to) {
      onDateChange(date.from, date.to);
    } else {
      onDateChange(null, null);
    }
  }, [currentDay, date, onDateChange, selectedMonth]);

  useEffect(() => {
    //se ejecuta cuando cambian las fechas(dia, mes o rango de fechas)
    handleDateChange();
  }, [date, currentDay, selectedMonth, handleDateChange]);

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-start justify-center text-center gap-5">
          {/* seleccionar rango de fechas */}
          <Label className="flex flex-col gap-1">
            Selecciona un rango de fechas
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={currentDay || !!selectedMonth}
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from
                    ? date.to
                      ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
                      : date.from.toLocaleDateString()
                    : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  locale={es}
                  initialFocus
                  mode="range"
                  selected={date}
                  onSelect={(range: DateRange | undefined) => setDate(range)} // Aseguramos que range sea DateRange o undefined
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </Label>
          {/* seleccionar un mes */}
          <Label className="flex flex-col gap-1">
            Seleccionar un mes
            <Input
              type="month"
              value={selectedMonth || ""}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setCurrentDay(false);
                setDate(undefined);
              }}
              disabled={currentDay}
            />
          </Label>
          {/* seleccionar un dia */}
          <Label className="h-full">
            Día actual
            <div className="flex items-center justify-center h-full py-4">
              <Checkbox
                checked={currentDay}
                onCheckedChange={(checked) => {
                  setCurrentDay(checked === true);
                  setSelectedMonth(null);
                  setDate(undefined);
                }}
              />
            </div>
          </Label>
        </div>
      </div>
    </>
  );
};
