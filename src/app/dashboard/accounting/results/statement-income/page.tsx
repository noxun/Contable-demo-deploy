"use client";

import { addDays, format } from "date-fns";
import { LoaderIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import DocViewer, {
  PDFRenderer,
  MSDocRenderer,

} from "@cyntler/react-doc-viewer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DateSelector } from "@/modules/shared/components/DateSelector";
import { formatNumber } from "@/modules/shared/utils/validate";
import { BreadcrumbDashboard } from "@/modules/shared/components/BreadcrumDash";
import { useQuery } from "@tanstack/react-query";
import { getAllDataStatementIncome } from "@/lib/data";
import { ButtonLinkPDF } from "@/modules/results/components/ButtonLinkPDF";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LevelData } from "@/modules/results/types/types";
import { StatementIncomePreview } from "@/modules/results/components/StatementIncomePreview";
import { EstadoResultadosTemplate } from "@/modules/shared/components/templatePDF/EstadoResultados";

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
  const [inSusSelected, setInSusSelected] = useState<boolean>(inSus);
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)
  const [isLoadingStatementIncome, setIsLoadingStatementIncome] = useState(false)
  const [pendingLevel, setPendingLevel] = useState<LevelData>(1)
  const [selectedLevel, setSelectedLevel] = useState<LevelData>(1)

  const { data: dataStatementIncome, refetch: refetchStatementIncome } = useQuery({
    queryKey: ["AllStatementIncome"],
    queryFn: () => getAllDataStatementIncome({
      iDate: format(dateRange.from || new Date(), 'yyyy-MM-dd'),
      eDate: format(dateRange.to || new Date(), 'yyyy-MM-dd'),
      typeFetchBalance: 2,
      level: pendingLevel,
      inSus
    }),
    enabled: false
  })

  const { refetch: refetchStatementIncomeExcel, isRefetching: isFetchingExcel } = useQuery({
    queryKey: ["AllStatementIncomeExcel"],
    queryFn: () => getAllDataStatementIncome({
      iDate: format(dateRange.from || new Date(), 'yyyy-MM-dd'),
      eDate: format(dateRange.to || new Date(), 'yyyy-MM-dd'),
      typeFetchBalance: 1,
      level: pendingLevel,
      inSus
    }),
    retry: 1,
    enabled: false
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
          currentLevel={selectedLevel}
          inSus={inSusSelected}
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

  const handleOnGenerateExcel = async () => {
    toast.info('Generando Excel...')

    try {
      const { data: linkExcel } = await refetchStatementIncomeExcel()
      if (!linkExcel) {
        throw new Error();
      }
      const link = document.createElement("a");
      link.href = linkExcel;
      toast.success('Archivo generado...')
      link.click();
    } catch (error) {
      console.error("Error al generar el archivo:", error);
      toast.error('Error al generar el archivo.');
    }
  }

  const handleOnRefetch = async () => {
    setIsLoadingStatementIncome(true)
    setInSusSelected((_) => inSus)
    setSelectedLevel(pendingLevel)
    await refetchStatementIncome()
    setIsLoadingStatementIncome(false)
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
            <Label htmlFor="inSus">Generar el reporte en dolares?</Label>
          </div>
        </div>
        <div className="flex gap-4 py-3 flex-row justify-end lg:flex-row w-full md:flex-col md:w-auto sm:justify-start">
          <Select
            value={pendingLevel.toString()}
            onValueChange={(value) => setPendingLevel(Number(value) as LevelData)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Selecciona un nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Jerarquia</SelectLabel>
                <SelectItem value="1">nivel 1</SelectItem>
                <SelectItem value="2">nivel 2</SelectItem>
                <SelectItem value="3">nivel 3</SelectItem>
                <SelectItem value="4">nivel 4</SelectItem>
                <SelectItem value="5">nivel 5</SelectItem>
                <SelectItem value="6">nivel 6</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleOnRefetch} disabled={isLoadingStatementIncome}>
            {isLoadingStatementIncome ? "Cargando..." : "Ver Resultados"}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 py-3 items-center">
        <Button
          onClick={handleOnGeneratePDF}
          disabled={!dataStatementIncome}
        >
          {isLoadingPDF ? 'Generando PDF...' : 'Generar PDF'}
        </Button>
        <Button
          className="w-fit flex gap-1 items-center"
          onClick={handleOnGenerateExcel}
          title={"Generar Excel"}
          disabled={isFetchingExcel || !dateRange.to}
        >
          {
            isFetchingExcel
              ? <><LoaderIcon className="animate-spin" />Cargando...</>
              : <>Generar Excel</>
          }

        </Button>
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
      <div className="pb-12" >
        {isLoadingStatementIncome && (
          <LoaderIcon className="mx-auto animate-spin size-10 text-[#2563EB]" />
        )}
        {
          dataStatementIncome && !isLoadingStatementIncome && (
            <div className="overflow-x-auto mx-auto w-[90vw] md:w-[900px] max-h-screen py-3">
              <div className="px-2 dark:text-[#bbbbbb]">
                <StatementIncomePreview
                  data={dataStatementIncome}
                  dateRange={dateRange}
                  currentLevel={selectedLevel}
                  inSus={inSusSelected}
                />
              </div>
            </div>
          )
        }
      </div>

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
