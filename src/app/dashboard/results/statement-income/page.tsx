"use client";
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
import { toast } from "sonner";

export default function StatementIncomePage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  });
  const [excelLink, setExcelLink] = useState<string | null>(null);
  const [pdfLink, setPdfLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (date?.from && date?.to) {
      setIsLoading(true);
      setExcelLink(null);
      setPdfLink(null);

      try {
        // Generar el reporte de Excel
        const excelResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/Xlxs/estadoDeResultado`,
          {
            params: {
              InitDate: format(date.from, "yyyy/MM/dd"),
              EndDate: format(date.to, "yyyy/MM/dd"),
              Level: 5,
            },
            responseType: "text",
          }
        );

        // Generar el reporte de PDF
        // const pdfResponse = await axios.get(
        //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/StamentIncome`,
        //   {
        //     params: {
        //       InitDate: format(date.from, "yyyy/MM/dd"),
        //       EndDate: format(date.to, "yyyy/MM/dd"),
        //       Level: 5,
        //     },
        //     responseType: "text",
        //   }
        // );

        if (excelResponse.data) {
          setExcelLink(excelResponse.data);
        }
        // if (pdfResponse.data) {
        //   setPdfLink(pdfResponse.data);
        // }

        toast.success("Reporte Generado Exitosamente");
      } catch (error) {
        console.error("Error al generar los reportes", error);
        toast.error("Error al generar los reportes, intente de nuevo");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-evenly">
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
                      {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                      {format(date.to, "LLL dd, y", { locale: es })}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y", { locale: es })
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
                locale={es}
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handleClick} disabled={isLoading}>
          {isLoading ? "Generando Reporte..." : "Generar Reporte"}
        </Button>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="icon"
            disabled={!excelLink}
            onClick={() => window.open(excelLink!, "_self")}
          >
            <Sheet className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!pdfLink}
            onClick={() => window.open(pdfLink!, "_blank")}
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <DataTable columns={[]} data={[]} />
    </div>
  );
}
