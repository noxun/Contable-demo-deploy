"use client";
import Select from "react-select";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, FileText, Sheet } from "lucide-react";
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
import { es } from "date-fns/locale";
import { DataTable } from "@/components/ui/data-table";

const options = [
  { value: "balanceDeSumas", label: "Balance De Sumas" },
  { value: "estadoDeResultado", label: "Estado De Resultado" },
  { value: "balanceGeneral", label: "Balance General" },
];

//biggerBook

export default function AccountingExcelPage() {
  const [selectType, setSelectType] = useState<string>("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  })
  const [fileLink, setFileLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (selectType && date?.from && date?.to) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/Xlxs/${selectType}`, {
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
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-evenly">
        <div className="w-72">
          <Select
            options={options}
            onChange={(value) => setSelectType(value!.value)}
            styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
          />
        </div>
        <div className="w-72">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
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
                locale={es  }
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* <Button onClick={handleClick} disabled={isLoading}>
          {isLoading ? 'Generando Reporte...' : 'Generar Reporte'}
        </Button> */}
        <Button variant="outline" size="icon">
            <Sheet className="h-4 w-4"/>
        </Button>
        <Button variant="outline" size="icon">
          <FileText className="h-4 w-4"/>
        </Button>
        {fileLink && (
          <a
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            href={fileLink}
            rel="noopener noreferrer"
            download
          >
            Descargar Reporte
          </a>
        )}
      </div>
      <DataTable columns={[]} data={[]}/>
    </div>
  );
}
