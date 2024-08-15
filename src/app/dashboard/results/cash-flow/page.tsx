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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export default function ClashFlowPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  });
  const [excelLink, setExcelLink] = useState<string | null>(null);
  const [pdfLink, setPdfLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [docs, setDocs] = useState<{ uri: string }[]>([{uri:"https://res.cloudinary.com/dm0aq4bey/raw/upload/v1717432529/report/balanceSum.xlsx"}]);
  const [generatedFiles, setGeneratedFiles] = useState<
    { type: string; date: string; link: string }[]
  >([]);

  const handleClick = async () => {
    if (date?.from && date?.to) {
      setIsLoading(true);
      setExcelLink(null);
      setPdfLink(null);
      setDocs([]);

      toast("Generando reporte...");

      try {
        // Generar el reporte de Excel
        const excelResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/ClashFlow`,
          {
            params: {
              InitDate: format(date.from, "yyyy/MM/dd"),
              EndDate: format(date.to, "yyyy/MM/dd"),
              type: "xlsx",
              inSus: true,
            },
            responseType: "text",
          }
        );

        // Generar el reporte de PDF
        const pdfResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/ClashFlow`,
          {
            params: {
              InitDate: format(date.from, "yyyy/MM/dd"),
              EndDate: format(date.to, "yyyy/MM/dd"),
              type: "pdf",
              inSus: true,
            },
            responseType: "text",
          }
        );

        const currentDate = new Date().toLocaleString();

        if (excelResponse.data) {
          setExcelLink(excelResponse.data);
          setDocs((prevDocs) => [
            ...prevDocs,
            { uri: excelResponse.data },
          ]);
          setGeneratedFiles((prevFiles) => [
            ...prevFiles,
            {
              type: "Excel",
              date: currentDate,
              link: excelResponse.data,
            },
          ]);
        }
        if (pdfResponse.data) {
          setPdfLink(pdfResponse.data);
          setDocs((prevDocs) => [
            ...prevDocs,
            { uri: pdfResponse.data },
          ]);
          setGeneratedFiles((prevFiles) => [
            ...prevFiles,
            {
              type: "PDF",
              date: currentDate,
              link: pdfResponse.data,
            },
          ]);
        }

        setShowDialog(true);
        toast.success("Reporte generado exitosamente");
      } catch (error) {
        console.error("Error al generar los reportes", error);
        toast.error("Error al generar el reporte, intente nuevamente");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const columns = [
    { header: "Tipo", accessorKey: "type" },
    { header: "Fecha", accessorKey: "date" },
    {
      header: "Enlace",
      accessorKey: "link",
      cell: ({ row }: any) => (
        <a href={row.original.link} target="_blank" rel="noopener noreferrer">
          Descargar
        </a>
      ),
    },
  ];

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
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="hidden">
            Mostrar Links
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archivos Generados</DialogTitle>
            <DialogDescription>
              Puedes descargar los reportes generados a continuación:
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-4">
            {excelLink && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(excelLink ?? "", "_self")}
              >
                <Sheet className="h-4 w-4" /> Descargar Excel
              </Button>
            )}
            {pdfLink && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(pdfLink ?? "", "_self")}
              >
                <FileText className="h-4 w-4" /> Descargar PDF
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />

      <DataTable columns={columns} data={generatedFiles} />
    </div>
  );
}
