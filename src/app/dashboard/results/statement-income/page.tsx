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
import React, { useState, useEffect } from "react";
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

} from "@/components/ui/dialog";
import DocViewer, {
  PDFRenderer,
  MSDocRenderer,

} from "@cyntler/react-doc-viewer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { EstadoResultadosTemplate } from "@/modules/shared/components/templatePDF/EstadoResultados";
import { DateSelector } from "@/modules/shared/components/DateSelector";
import { ReportGeneratorFile } from "@/modules/shared/components/ReportGeneratorFile";
import { ReportExcelGenerate } from "@/modules/shared/components/ReportExcelGenerator";
import { formatNumber, ReportPaths } from "@/modules/shared/utils/validate";
import { BreadcrumbDashboard } from "@/modules/shared/components/BreadcrumDash";
import { useQuery } from "@tanstack/react-query";
import { getAllDataReportByType } from "@/lib/data";
import { ButtonLinkPDF } from "@/modules/results/components/ButtonLinkPDF";

export default function StatementIncomePage() {
  // --- Estados del formulario ---
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  });

  const [currentDay, setCurrentDay] = useState<boolean | "indeterminate">(
    false
  );
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // --- Estados de los links ---
  const [excelLink, setExcelLink] = useState<string | null>(null);
  // const [pdfLink, setPdfLink] = useState<string | null>(null);

  // --- Estados de carga o visualizacion ---
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // --- Estados de los documentos para la tabla y el visor ---
  const [docs, setDocs] = useState<{ uri: string }[]>([]);

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
    let initDate: Date | null = null;
    let endDate: Date | null = null;

    if (currentDay) {
      const today = new Date();
      initDate = today;
      endDate = today;
    } else if (selectedMonth) {
      const [year, month] = selectedMonth.split("-").map(Number);
      initDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    } else if (date?.from && date?.to) {
      initDate = date.from;
      endDate = date.to;
    }

    if (initDate && endDate) {
      setIsLoading(true);
      setExcelLink(null);
      // setPdfLink(null);
      setDocs([]);
      toast("Generando reporte...");
      try {
        // Generar el reporte de Excel
        const excelResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/Xlxs/estadoDeResultado`,
          {
            params: {
              InitDate: format(initDate, "yyyy/MM/dd"),
              EndDate: format(endDate, "yyyy/MM/dd"),
              type: "xlsx",
              inSus: inSus,
              businessId: 0 //cambiar esto cuando haya unidad de negocios
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
        //       //type: "pdf",
        //       inSus: inSus,
        //       Level: 5, //Averiguar que es level
        //       businessId: 0 //cambiar esto cuando haya unidad de negocios
        //     },
        //     responseType: "text",
        //   }
        // );
        const currentDate = new Date().toLocaleString();
        // if (pdfResponse.data) {
        //   setPdfLink(pdfResponse.data);
        //   setDocs((prevDocs) => [...prevDocs, { uri: pdfResponse.data }]);
        //   setGeneratedFiles((prevFiles) => [
        //     ...prevFiles,
        //     {
        //       type: "PDF",
        //       date: currentDate,
        //       link: pdfResponse.data,
        //     },
        //   ]);
        // }
        if (excelResponse.data) {
          setExcelLink(excelResponse.data);
          setDocs((prevDocs) => [...prevDocs, { uri: excelResponse.data }]);
          setGeneratedFiles((prevFiles) => [
            ...prevFiles,
            {
              type: "Excel",
              date: currentDate,
              link: excelResponse.data,
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

  const initialDateRange = {
    from: new Date(Date.now())
  }

  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [pdfFile, setPdfFile] = useState<JSX.Element | null>(null)
  const [inSus, setInSus] = useState<boolean>(false);
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)
  const { data: dataStatementIncome } = useQuery({
    queryKey: ["AllStatementIncome", format(dateRange.from ?? new Date(), 'dd-MM-yyyy')],

    queryFn: () => getAllDataReportByType({
      iDate: format(dateRange.from || new Date(), 'yyyy-MM-dd'),
      eDate: format(dateRange.to || new Date(), 'yyyy-MM-dd'),
      typePath: "estadoDeResultado",
      level: 2
    }),
    enabled: !!dateRange.from && !!dateRange.to
  })


  const handleOnDateChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setPdfFile(null)
      setDateRange({
        from: startDate,
        to: endDate
      })
    }
  };

  const handleChangeIsSus = () => setInSus(!inSus)

  const handleOnGeneratePDF = async () => {
    setPdfFile(null)
    if (!dataStatementIncome) return
    try {
      setIsLoadingPDF(true);
      toast("Generando reporte...");
      const MyDocument = (
        <EstadoResultadosTemplate
          dateRange={dateRange}
          records={dataStatementIncome}
        />
      );
      setPdfFile(MyDocument);
      toast.success("Reporte generado exitosamente");
    } catch (error) {
      toast.error("Error al generar el reporte, intente nuevamente")
    } finally {
      setIsLoadingPDF(false);
    }
  }

  type ColumnType = "Ingresos" | "Gastos";
  const createColumns = (type: ColumnType) => [
    {
      header: "Cuenta",
      accessorKey: "account",
      cell: ({ row }: any) => row.original.account,
    },
    {
      header: type,
      accessorKey: "description",
      cell: ({ row }: any) => row.original.description,
    },
    {
      header: "Monto",
      accessorKey: "amount",
      cell: ({ row }: any) => formatNumber(row.original.amount),
    },
  ];

  const columnsIncome = createColumns('Ingresos')
  const columnsExpenses = createColumns('Gastos')

  return (
    <div className="flex flex-col gap-6 h-full">
      <BreadcrumbDashboard
        items={[
          {
            label: "Panel",
            href: "/dashboard"
          },
          {
            label: "Reportes",
            href: "#"
          },
          {
            label: "Estado de resultados",
            href: "/dashboard/results/statement-income"
          }
        ]}
      />
      <div className="flex flex-col items-start justify-evenly md:flex-row md:items-center">
        <div className="flex gap-2 flex-col">
          {/* Rango de fechas */}
          <div className="flex items-center gap-4">
            <DateSelector onDateChange={handleOnDateChange} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="inSus" checked={inSus} onCheckedChange={handleChangeIsSus} />
            <Label htmlFor="inSus">Devolver el reporte en dolares?</Label>
          </div>
        </div>
        <div className="flex gap-4 py-3 flex-row justify-end lg:flex-row w-full md:flex-col md:w-auto sm:justify-start">
          <Button
            onClick={handleOnGeneratePDF}
            disabled={!dataStatementIncome}
          >
            {isLoadingPDF ? 'Generando PDF...' : 'Generar PDF'}
          </Button>
          <ReportExcelGenerate
            dateRange={dateRange}
            inSus={inSus}
            typeFile={ReportPaths.reportExcel}
            typePathExcel="estadoDeResultado"
          />
        </div>
      </div>

      {/* <Dialog open={showDialog} onOpenChange={setShowDialog}>
        Comentado pero podria ser util si se requiere en algun momento
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
              <Button onClick={() => window.open(excelLink ?? "", "_self")}>
                <Sheet className="mr-2 h-4 w-4" /> Descargar Excel
              </Button>
            )}
            {pdfLink && (
              <Button onClick={() => window.open(pdfLink ?? "", "_self")}>
                <FileText className="mr-2 h-4 w-4" /> Descargar PDF
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog> */}


      {/* alternativa para descargar  */}
      {/* <GeneratedFilesTable nameFile="l_diario" data={generatedFiles} /> */}

      {/* Descargar PDF (estado de resultados) */}
      <div className="h-16 flex items-center">
        {pdfFile && (
          <ButtonLinkPDF
            pdfFile={pdfFile}
            nameFile="R_estado_resultados"
          />
        )}
      </div>
      {/* Vista Previa */}
      {
        dataStatementIncome && (
          <section className="flex flex-col gap-2">
            <details>
              <summary className="pb-2">Ingresos</summary>
              <>
                <DataTable columns={columnsIncome} data={dataStatementIncome.income} />

              </>
            </details>
            <details>
              <summary className="pb-2">Gastos</summary>
              <DataTable columns={columnsExpenses} data={dataStatementIncome.expenses} />
            </details>
            <details>
              <summary className="pb-2">Resultados</summary>
              <div className="grid grid-cols-2 w-full sm:w-1/2 gap-1 text-sm text-gray-600 font-semibold">
                {
                  [
                    { label: 'Total Gastos', value: formatNumber(dataStatementIncome.totalExpense) },
                    { label: 'Total Ingresos', value: formatNumber(dataStatementIncome.totalIncome) },
                    { label: 'Impuestos antes de utilidades', value: formatNumber(dataStatementIncome.periodUtility) },
                    { label: 'Impuestos alas utilidades', value: formatNumber(dataStatementIncome.taxOnProfits) },
                    { label: 'Resultado de gestion', value: formatNumber(dataStatementIncome.managementResult) },
                  ].map((item, index) => (
                    <React.Fragment key={index}>
                      <p>{item.label}</p>
                      <p className="text-base text-right">{item.value}</p>
                    </React.Fragment>
                  ))
                }
              </div>
            </details>
          </section>
        )
      }

      {/* <DocViewer
        activeDocument={activeDocument}
        onDocumentChange={handleDocumentChange}
        key={viewerKey}
        style={{ height: 1000 }}
        documents={docs}
        pluginRenderers={[PDFRenderer, MSDocRenderer]}
        language="es"
      /> */}
    </div>
  );
}
