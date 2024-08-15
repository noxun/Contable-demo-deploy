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
import { useState, useEffect } from "react";
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
import DocViewer, {
  PDFRenderer,
  MSDocRenderer,
  IDocument,
} from "@cyntler/react-doc-viewer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function StatementIncomePage() {
  // --- Estados del formulario ---
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  });
  const [inSus, setInSus] = useState<boolean | "indeterminate">(false);

  // --- Estados de los links ---
  //const [excelLink, setExcelLink] = useState<string | null>(null);
  const [pdfLink, setPdfLink] = useState<string | null>(null);

  // --- Estados de carga o visualizacion ---
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // --- Estados de los documentos para la tabla y el visor ---
  const [docs, setDocs] = useState<{ uri: string }[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<
    { type: string; date: string; link: string }[]
  >([]);

  /*
    Estos estados controlan la llave y el documento activo actual del visor
    debido a un error en la libreria, se necesita esto mas la funcion
    handleDocumentPage para rerenderizar el visor de archivos
    https://github.com/cyntler/react-doc-viewer/issues/161
    Probablemente esto sea arreglado en la proxima release de la libreria
    pero de momento este es el fix que se tiene.
   */
  const [viewerKey, setViewerKey] = useState(0);
  const [activeDocument, setActiveDocument] = useState(docs[0]);

  const handleDocumentChange = (document: any) => {
    setActiveDocument(document);
    setViewerKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    setViewerKey((prevKey) => prevKey + 1);
  }, [docs]);

  // --- Logica del componente ---
  const handleClick = async () => {
    if (date?.from && date?.to) {
      setIsLoading(true);
      //setExcelLink(null);
      setPdfLink(null);
      setDocs([]);
      toast("Generando reporte...");
      try {
        // Generar el reporte de Excel
        // const excelResponse = await axios.get(
        //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/StamentIncome`,
        //   {
        //     params: {
        //       InitDate: format(date.from, "yyyy/MM/dd"),
        //       EndDate: format(date.to, "yyyy/MM/dd"),
        //       type: "xlsx",
        //       inSus: inSus,
        //       businessId: 0 //cambiar esto cuando haya unidad de negocios
        //     },
        //     responseType: "text",
        //   }
        // );
        // Generar el reporte de PDF
        const pdfResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/StamentIncome`,
          {
            params: {
              InitDate: format(date.from, "yyyy/MM/dd"),
              EndDate: format(date.to, "yyyy/MM/dd"),
              //type: "pdf",
              inSus: inSus,
              Level: 5, //Averiguar que es level
              businessId: 0 //cambiar esto cuando haya unidad de negocios
            },
            responseType: "text",
          }
        );
        const currentDate = new Date().toLocaleString();
        if (pdfResponse.data) {
          setPdfLink(pdfResponse.data);
          setDocs((prevDocs) => [...prevDocs, { uri: pdfResponse.data }]);
          setGeneratedFiles((prevFiles) => [
            ...prevFiles,
            {
              type: "PDF",
              date: currentDate,
              link: pdfResponse.data,
            },
          ]);
        }
        // if (excelResponse.data) {
        //   setExcelLink(excelResponse.data);
        //   setDocs((prevDocs) => [...prevDocs, { uri: excelResponse.data }]);
        //   setGeneratedFiles((prevFiles) => [
        //     ...prevFiles,
        //     {
        //       type: "Excel",
        //       date: currentDate,
        //       link: excelResponse.data,
        //     },
        //   ]);
        // }
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
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-evenly">
        <div className="w-72 space-y-2">
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
          <div className="flex items-center space-x-2">
            <Checkbox id="inSus" checked={inSus} onCheckedChange={setInSus} />
            <Label htmlFor="inSus">Devolver el reporte en dolares?</Label>
          </div>
        </div>
        <Button onClick={handleClick} disabled={isLoading}>
          {isLoading ? "Generando Reporte..." : "Generar Reporte"}
        </Button>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        {/* Comentado pero podria ser util si se requiere en algun momento */}
        {/* <DialogTrigger asChild>
          <Button variant="outline" className="hidden">
            Mostrar Links
          </Button>
        </DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archivos Generados</DialogTitle>
            <DialogDescription>
              Puedes descargar los reportes generados a continuación:
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-4">
            {/* {excelLink && (
              <Button onClick={() => window.open(excelLink ?? "", "_self")}>
                <Sheet className="mr-2 h-4 w-4" /> Descargar Excel
              </Button>
            )} */}
            {pdfLink && (
              <Button onClick={() => window.open(pdfLink ?? "", "_self")}>
                <FileText className="mr-2 h-4 w-4" /> Descargar PDF
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={generatedFiles} />
      <DocViewer
        activeDocument={activeDocument}
        onDocumentChange={handleDocumentChange}
        key={viewerKey}
        style={{ height: 1000 }}
        documents={docs}
        pluginRenderers={[PDFRenderer, MSDocRenderer]}
        language="es"
      />
    </div>
  );
}
