"use client";
import Select from "react-select";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import axios from "axios";

const options = [
  { value: "balanceDeSumas", label: "Balance De Sumas" },
  { value: "estadoDeResultado", label: "Estado De Resultado" },
  { value: "balanceGeneral", label: "Balance General" },
];

export default function AccountingPage() {
  const [selectType, setSelectType] = useState<string>("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  })

  const [fileLink, setFileLink] = useState<string | null>(null);

  console.log(date, selectType);

  const handleClick = async () => {
    if (selectType && date?.from && date?.to) {
      try {
        const response = await axios.get(`http://localhost:5050/api/Report/Xlxs/${selectType}`, {
          params: {
            InitDate: format(date.from, "yyyy/MM/dd"),
            EndDate: format(date.to, "yyyy/MM/dd"),
            Level: 5,
          },
          responseType: 'text',
        });

        if (response.data) {
          setFileLink(response.data);
        }
      } catch (error) {
        console.error("Error al generar el reporte", error);
      }
    }
  };

  return (
    <div>
      <Select options={options} onChange={(value) => setSelectType(value!.value)}/>
      <div className={cn("grid gap-2")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button onClick={handleClick}>Generar Reporte</Button>
      {fileLink && (
        <a href={fileLink} target="_blank" rel="noopener noreferrer" download>
          Descargar Reporte
        </a>
      )}
    </div>
  );
}
